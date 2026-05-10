"use client";
/**
 * ZuzBuilder
 *
 * The top-level Visual Builder module.  Owns the ZuzNode tree state and
 * exposes:
 *
 *  - splitNode(id, direction) – transform an empty cell into a nested grid.
 *  - updateNode(id, patch)    – mutate as / props / component on a node.
 *  - deleteNode(id)           – remove a node from its parent.
 *  - moveNode(sourceId, targetParentId, index) – reorder / reparent.
 *  - undo / redo via history stack.
 *
 * Renders:
 *  - <VisualCanvas>  – interactive preview panel.
 *  - Toolbar         – undo/redo, save, column picker.
 *  - Inspector panel – edit the selected node's `as` string.
 */

import React, { useCallback, useReducer, useState } from "react";
import Box from "../comps/Box";
import Button from "../comps/Button";
import Flex from "../comps/Flex";
import Text from "../comps/Text";
import { generatePageSource } from "./compiler";
import { VisualCanvas } from "./visual-canvas";
import type {
    SplitDirection,
    ZuzBuilderAction,
    ZuzGridNode,
    ZuzNode,
    ZuzTree,
} from "./zuz-node";

// ─── ID factory ──────────────────────────────────────────────────────────────

let _counter = 0;
function makeId(prefix = "node"): string {
    return `${prefix}-${Date.now()}-${++_counter}`;
}

// ─── Tree mutation helpers ────────────────────────────────────────────────────

/** Deep-clone without external dependencies */
function cloneTree(node: ZuzNode): ZuzNode {
    return JSON.parse(JSON.stringify(node));
}

/**
 * Produce the column count implied by a SplitDirection.
 */
function splitDirectionToGrid(direction: SplitDirection): Pick<ZuzGridNode, "columns" | "rows"> {
    switch (direction) {
        case "2-col": return { columns: 2 };
        case "3-col": return { columns: 3 };
        case "4-col": return { columns: 4 };
        case "2-row": return { columns: 1, rows: 2 };
        case "3-row": return { columns: 1, rows: 3 };
    }
}

/**
 * Return the number of empty child cells required for the split.
 * Row splits produce stacked single-column containers.
 */
function splitDirectionToCellCount(direction: SplitDirection): number {
    switch (direction) {
        case "2-col": return 2;
        case "3-col": return 3;
        case "4-col": return 4;
        case "2-row": return 2;
        case "3-row": return 3;
    }
}

/**
 * Mutate (in-place on a cloned root) the target node into a grid.
 * Returns true if the target was found and updated.
 */
function applySplit(root: ZuzNode, targetId: string, direction: SplitDirection): boolean {
    if (root.id === targetId) {
        const { columns, rows } = splitDirectionToGrid(direction);
        const cellCount = splitDirectionToCellCount(direction);
        const target = root as ZuzGridNode;

        target.type = "grid";
        target.columns = columns;
        if (rows) target.rows = rows;
        target.as = [
            "grid",
            columns > 1 ? `gtc:[repeat(${columns},1fr)]` : "",
            rows && rows > 1 ? `gtr:[repeat(${rows},1fr)]` : "",
            "gap:8",
        ].filter(Boolean);

        // Populate with empty grid cells
        target.children = Array.from({ length: cellCount }, () => ({
            id: makeId("cell"),
            type: "grid" as const,
            columns: 1,
            as: ["grid", "gap:8"],
            children: [],
        }));

        return true;
    }

    return (root.children ?? []).some((child) => applySplit(child, targetId, direction));
}

/**
 * Mutate (in-place on a cloned root) the target node's props.
 */
function applyUpdate(
    root: ZuzNode,
    targetId: string,
    patch: Partial<Pick<ZuzNode, "as" | "props" | "component">>
): boolean {
    if (root.id === targetId) {
        if (patch.as !== undefined) root.as = patch.as;
        if (patch.props !== undefined) root.props = { ...root.props, ...patch.props };
        if (patch.component !== undefined) root.component = patch.component;
        return true;
    }
    return (root.children ?? []).some((child) => applyUpdate(child, targetId, patch));
}

/**
 * Remove a node by id from the tree. Returns true if found and removed.
 */
function applyDelete(root: ZuzNode, targetId: string): boolean {
    if (!root.children) return false;
    const idx = root.children.findIndex((c) => c.id === targetId);
    if (idx !== -1) {
        root.children.splice(idx, 1);
        return true;
    }
    return root.children.some((child) => applyDelete(child, targetId));
}

/**
 * Find a node by id and return a shallow reference.
 */
function findNode(root: ZuzNode, targetId: string): ZuzNode | null {
    if (root.id === targetId) return root;
    for (const child of root.children ?? []) {
        const found = findNode(child, targetId);
        if (found) return found;
    }
    return null;
}

// ─── Reducer ─────────────────────────────────────────────────────────────────

interface BuilderState {
    tree: ZuzTree;
    past: ZuzTree[];
    future: ZuzTree[];
}

function builderReducer(state: BuilderState, action: ZuzBuilderAction): BuilderState {
    const newRoot = cloneTree(state.tree.root);

    switch (action.type) {
        case "SPLIT": {
            applySplit(newRoot, action.targetId, action.direction);
            break;
        }
        case "UPDATE_NODE": {
            applyUpdate(newRoot, action.targetId, action.patch);
            break;
        }
        case "DELETE_NODE": {
            applyDelete(newRoot, action.targetId);
            break;
        }
        case "MOVE_NODE": {
            const sourceNode = findNode(newRoot, action.sourceId);
            if (!sourceNode) return state;
            applyDelete(newRoot, action.sourceId);
            const targetParent = findNode(newRoot, action.targetParentId);
            if (!targetParent) return state;
            targetParent.children = targetParent.children ?? [];
            targetParent.children.splice(action.index, 0, sourceNode);
            break;
        }
        default:
            return state;
    }

    const newTree: ZuzTree = { ...state.tree, root: newRoot };

    return {
        tree: newTree,
        past: [...state.past, state.tree],
        future: [],
    };
}

// Undo / redo are handled outside the main action type for clarity
type HistoryAction = { type: "UNDO" } | { type: "REDO" };

function historyReducer(
    state: BuilderState,
    action: ZuzBuilderAction | HistoryAction
): BuilderState {
    if (action.type === "UNDO") {
        if (state.past.length === 0) return state;
        const prev = state.past[state.past.length - 1];
        return {
            tree: prev,
            past: state.past.slice(0, -1),
            future: [state.tree, ...state.future],
        };
    }
    if (action.type === "REDO") {
        if (state.future.length === 0) return state;
        const next = state.future[0];
        return {
            tree: next,
            past: [...state.past, state.tree],
            future: state.future.slice(1),
        };
    }
    return builderReducer(state, action as ZuzBuilderAction);
}

// ─── Inspector Panel ─────────────────────────────────────────────────────────

interface InspectorProps {
    node: ZuzNode | null;
    onUpdate: (patch: Partial<Pick<ZuzNode, "as" | "props" | "component">>) => void;
    onDelete: () => void;
}

const Inspector: React.FC<InspectorProps> = ({ node, onUpdate, onDelete }) => {
    const [asValue, setAsValue] = useState(() =>
        node ? (Array.isArray(node.as) ? node.as.join(" ") : node.as ?? "") : ""
    );

    // Sync local state when a different node is selected
    React.useEffect(() => {
        setAsValue(node ? (Array.isArray(node.as) ? node.as.join(" ") : node.as ?? "") : "");
    }, [node?.id]);

    if (!node) {
        return (
            <Box as="p:16 r:8 bg:[$surface-2] border:1,[$border-color],solid">
                <Text as="fs:12 c:[$text-muted]">Select a node to inspect.</Text>
            </Box>
        );
    }

    return (
        <Flex as="flex cols gap:12 p:16 r:8 bg:[$surface-2] border:1,[$border-color],solid">
            <Flex as="flex jcb aic">
                <Text as="fs:12 bold c:[$text]">{node.id}</Text>
                <Box
                    as="p:4,8 r:4 bg:[$danger-faint] c:[$danger] fs:11 pointer &hover(bg:[$danger] c:white)"
                    onClick={onDelete}
                >
                    Delete
                </Box>
            </Flex>

            <Box>
                <Text as="fs:11 c:[$text-muted] mb:4">as tokens</Text>
                {/* Plain textarea – replace with a rich tokenised editor as needed */}
                <textarea
                    value={asValue}
                    onChange={(e) => setAsValue(e.target.value)}
                    onBlur={() => onUpdate({ as: asValue })}
                    rows={3}
                    style={{
                        width: "100%",
                        fontFamily: "monospace",
                        fontSize: 12,
                        padding: "6px 8px",
                        borderRadius: 6,
                        border: "1px solid var(--border-color)",
                        background: "var(--surface)",
                        color: "var(--text)",
                        resize: "vertical",
                    }}
                />
            </Box>
        </Flex>
    );
};

// ─── ZuzBuilder ───────────────────────────────────────────────────────────────

export interface ZuzBuilderProps {
    /** Initial tree. Provide a minimal root grid node to start empty. */
    initialTree: ZuzTree;
    /**
     * Called after every mutation with the latest tree and the compiled
     * JSX source string so the caller can persist / preview as needed.
     */
    onChange?: (tree: ZuzTree, source: string) => void;
    /**
     * Called when the user presses "Save". Receives the compiled source.
     * Wire this up to POST /api/zuz/save.
     */
    onSave?: (source: string) => Promise<void>;
}

export const ZuzBuilder: React.FC<ZuzBuilderProps> = ({
    initialTree,
    onChange,
    onSave,
}) => {
    const [state, dispatch] = useReducer(historyReducer, {
        tree: initialTree,
        past: [],
        future: [],
    });

    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    const selectedNode = selectedId ? findNode(state.tree.root, selectedId) : null;

    // Notify parent on every change
    React.useEffect(() => {
        const source = generatePageSource(state.tree);
        onChange?.(state.tree, source);
    }, [state.tree]);

    const handleSplitRequest = useCallback(
        (nodeId: string, direction: SplitDirection) => {
            dispatch({ type: "SPLIT", targetId: nodeId, direction });
        },
        []
    );

    const handleUpdate = useCallback(
        (patch: Partial<Pick<ZuzNode, "as" | "props" | "component">>) => {
            if (!selectedId) return;
            dispatch({ type: "UPDATE_NODE", targetId: selectedId, patch });
        },
        [selectedId]
    );

    const handleDelete = useCallback(() => {
        if (!selectedId) return;
        dispatch({ type: "DELETE_NODE", targetId: selectedId });
        setSelectedId(null);
    }, [selectedId]);

    const handleSave = useCallback(async () => {
        if (!onSave) return;
        setSaving(true);
        setSaveError(null);
        try {
            const source = generatePageSource(state.tree);
            await onSave(source);
        } catch (err) {
            setSaveError(err instanceof Error ? err.message : "Save failed");
        } finally {
            setSaving(false);
        }
    }, [onSave, state.tree]);

    return (
        <Flex as="flex cols gap:0 w:full h:full min-h:600">

            {/* ── Toolbar ─────────────────────────────────────────────── */}
            <Flex as="flex aic jcb gap:8 p:8,16 bg:[$surface-2] border-bottom:1,[$border-color],solid">
                <Text as="fs:13 bold c:[$text]">ZuzBuilder</Text>

                <Flex as="flex aic gap:8">
                    <Button
                        as="p:6,12 r:6 fs:12"
                        disabled={state.past.length === 0}
                        onClick={() => dispatch({ type: "UNDO" } as any)}
                    >
                        ↩ Undo
                    </Button>
                    <Button
                        as="p:6,12 r:6 fs:12"
                        disabled={state.future.length === 0}
                        onClick={() => dispatch({ type: "REDO" } as any)}
                    >
                        ↪ Redo
                    </Button>

                    {onSave && (
                        <Button
                            as="p:6,16 r:6 fs:12 bg:[$brand] c:white &hover(opacity:0.85)"
                            busy={saving}
                            onClick={handleSave}
                        >
                            {saving ? "Saving…" : "Save"}
                        </Button>
                    )}
                </Flex>

                {saveError && (
                    <Text as="fs:11 c:[$danger]">{saveError}</Text>
                )}
            </Flex>

            {/* ── Main workspace ──────────────────────────────────────── */}
            <Flex as="flex flex-1 gap:0 overflow:hidden">

                {/* Canvas */}
                <Box as="flex-1 overflow:auto p:16">
                    <VisualCanvas
                        tree={state.tree}
                        onSplitRequest={handleSplitRequest}
                        onSelect={setSelectedId}
                        selectedId={selectedId}
                    />
                </Box>

                {/* Inspector sidebar */}
                <Box as="w:280 border-left:1,[$border-color],solid overflow:auto p:16">
                    <Text as="fs:11 bold c:[$text-muted] mb:12 uppercase ls:1">Inspector</Text>
                    <Inspector
                        node={selectedNode}
                        onUpdate={handleUpdate}
                        onDelete={handleDelete}
                    />
                </Box>
            </Flex>
        </Flex>
    );
};

// ─── Factory helpers ──────────────────────────────────────────────────────────

/**
 * Create a minimal blank ZuzTree with a single root grid cell.
 */
export function createBlankTree(name = "Untitled Page"): ZuzTree {
    return {
        id: makeId("tree"),
        name,
        root: {
            id: makeId("root"),
            type: "grid",
            columns: 1,
            as: ["grid", "gap:16", "p:24", "w:full"],
            children: [
                {
                    id: makeId("cell"),
                    type: "grid",
                    columns: 1,
                    as: ["grid", "gap:8"],
                    children: [],
                } as ZuzGridNode,
            ],
        } as ZuzGridNode,
    };
}

export default ZuzBuilder;
