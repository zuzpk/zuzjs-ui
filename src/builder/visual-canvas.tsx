"use client";
/**
 * VisualCanvas
 *
 * Recursive renderer for the ZuzBuilder tree.
 * Renders each ZuzNode as a @zuzjs/ui component with an interactive overlay
 * so the user can click cells to select / split them.
 *
 * Responsibilities:
 *  - Walk the ZuzNode tree depth-first.
 *  - Grid nodes  → <Flex> layout containers with cell overlays.
 *  - Component nodes → live preview of the actual @zuzjs/ui component.
 *  - Selection highlight (--zb-selected class).
 *  - Empty cell detection → shows a "+" split trigger on hover.
 */

import React, { createContext, useCallback, useContext, useState } from "react";
import Box from "../comps/Box";
import Flex from "../comps/Flex";
import Text from "../comps/Text";
import type { SplitDirection, ZuzNode, ZuzTree } from "./zuz-node";

// ─── Canvas context ──────────────────────────────────────────────────────────

interface CanvasContextValue {
    selectedId: string | null;
    selectNode: (id: string) => void;
    onSplitRequest: (id: string, direction: SplitDirection) => void;
}

const CanvasContext = createContext<CanvasContextValue>({
    selectedId: null,
    selectNode: () => {},
    onSplitRequest: () => {},
});

// ─── Split picker ────────────────────────────────────────────────────────────

const SPLIT_OPTIONS: { label: string; value: SplitDirection }[] = [
    { label: "2 cols", value: "2-col" },
    { label: "3 cols", value: "3-col" },
    { label: "4 cols", value: "4-col" },
    { label: "2 rows", value: "2-row" },
    { label: "3 rows", value: "3-row" },
];

interface SplitPickerProps {
    nodeId: string;
    onClose: () => void;
}

const SplitPicker: React.FC<SplitPickerProps> = ({ nodeId, onClose }) => {
    const { onSplitRequest } = useContext(CanvasContext);

    return (
        <Flex
            as="abs flex cols gap:4 p:8 r:8 bg:[$surface] shadow:0,4,12,$shadow"
            style={{ top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 100 }}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
        >
            {SPLIT_OPTIONS.map((opt) => (
                <Box
                    key={opt.value}
                    as="p:6,12 r:6 bg:[$brand] c:white fs:12 pointer &hover(opacity:0.8)"
                    onClick={() => {
                        onSplitRequest(nodeId, opt.value);
                        onClose();
                    }}
                >
                    {opt.label}
                </Box>
            ))}
            <Box
                as="p:6,12 r:6 bg:[$danger] c:white fs:12 pointer &hover(opacity:0.8)"
                onClick={onClose}
            >
                Cancel
            </Box>
        </Flex>
    );
};

// ─── Empty cell placeholder ──────────────────────────────────────────────────

interface EmptyCellProps {
    node: ZuzNode;
}

const EmptyCell: React.FC<EmptyCellProps> = ({ node }) => {
    const [showPicker, setShowPicker] = useState(false);
    const { selectedId, selectNode } = useContext(CanvasContext);
    const isSelected = selectedId === node.id;

    return (
        <Flex
            as={[
                "rel flex aic jcc",
                "min-h:120",
                "r:6",
                "border:1,[$border-color],dashed",
                isSelected ? "bg:[$brand-faint]" : "bg:[$surface-2]",
                "&hover(bg:[$brand-faint] border-color:[$brand])",
                "pointer",
            ]}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
                e.stopPropagation();
                selectNode(node.id);
                setShowPicker(true);
            }}
        >
            <Text as="c:[$text-muted] fs:24 select-none">+</Text>
            {showPicker && (
                <SplitPicker nodeId={node.id} onClose={() => setShowPicker(false)} />
            )}
        </Flex>
    );
};

// ─── Node renderer ───────────────────────────────────────────────────────────

interface NodeRendererProps {
    node: ZuzNode;
    depth?: number;
}

const NodeRenderer: React.FC<NodeRendererProps> = ({ node, depth = 0 }) => {
    const { selectedId, selectNode } = useContext(CanvasContext);
    const isSelected = selectedId === node.id;

    // Selection outline injected via an extra class token
    const selectionToken = isSelected ? "--zb-selected" : "";

    const handleClick = useCallback(
        (e: React.MouseEvent) => {
            e.stopPropagation();
            selectNode(node.id);
        },
        [node.id, selectNode]
    );

    // ── Grid node ─────────────────────────────────────────────────────────
    if (node.type === "grid") {
        const columns = (node as any).columns ?? 1;
        const baseAs = Array.isArray(node.as)
            ? node.as.join(" ")
            : node.as ?? "";
        const gridAs = [
            "grid",
            columns > 1 ? `gtc:[repeat(${columns},1fr)]` : "",
            "gap:8",
            "p:8",
            "r:8",
            "min-h:80",
            depth === 0 ? "w:full" : "",
            baseAs,
            selectionToken,
        ]
            .filter(Boolean)
            .join(" ");

        const isEmpty = !node.children || node.children.length === 0;

        return (
            <Flex as={gridAs} onClick={handleClick}>
                {isEmpty ? (
                    <EmptyCell node={node} />
                ) : (
                    node.children!.map((child) => (
                        <NodeRenderer key={child.id} node={child} depth={depth + 1} />
                    ))
                )}
            </Flex>
        );
    }

    // ── Component node ────────────────────────────────────────────────────
    // Render a labelled placeholder in the builder canvas instead of the
    // real component to keep the canvas lightweight and predictable.
    const componentAs = [
        "rel p:12 r:6 bg:[$surface-3] border:1,[$border-color],solid",
        "pointer select-none",
        isSelected ? "border-color:[$brand]" : "",
        Array.isArray(node.as) ? node.as.join(" ") : node.as ?? "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <Box as={componentAs} onClick={handleClick}>
            <Text as="fs:11 c:[$text-muted] mb:4">{node.component ?? "Box"}</Text>
            {typeof node.props?.children === "string" && (
                <Text as="fs:13 c:[$text]">{node.props.children as string}</Text>
            )}
        </Box>
    );
};

// ─── VisualCanvas ─────────────────────────────────────────────────────────────

export interface VisualCanvasProps {
    /** The tree to render */
    tree: ZuzTree;
    /** Called when the user requests a split on a cell */
    onSplitRequest: (nodeId: string, direction: SplitDirection) => void;
    /** Called when a node is selected; provides the node id */
    onSelect?: (nodeId: string | null) => void;
    /** Controlled selected node id */
    selectedId?: string | null;
}

export const VisualCanvas: React.FC<VisualCanvasProps> = ({
    tree,
    onSplitRequest,
    onSelect,
    selectedId: controlledSelectedId,
}) => {
    const [internalSelectedId, setInternalSelectedId] = useState<string | null>(null);

    const selectedId =
        controlledSelectedId !== undefined ? controlledSelectedId : internalSelectedId;

    const selectNode = useCallback(
        (id: string) => {
            setInternalSelectedId(id);
            onSelect?.(id);
        },
        [onSelect]
    );

    const deselect = useCallback(() => {
        setInternalSelectedId(null);
        onSelect?.(null);
    }, [onSelect]);

    return (
        <CanvasContext.Provider value={{ selectedId, selectNode, onSplitRequest }}>
            {/* Canvas shell */}
            <Box
                as="rel w:full min-h:400 bg:[$surface] r:12 p:16 overflow:hidden"
                onClick={deselect}
            >
                <NodeRenderer node={tree.root} depth={0} />
            </Box>
        </CanvasContext.Provider>
    );
};

export default VisualCanvas;
