/**
 * ZuzNode Tree Types
 *
 * Defines the recursive JSON data model for the Visual Builder Engine.
 * Every element in the canvas is represented as a ZuzNode — either a
 * layout container (grid) or a leaf component (component).
 */

// ─── Atomic shorthand string ────────────────────────────────────────────────
// Matches the `as` prop grammar from the @zuzjs/ui style system.
// Examples: "p:20", "aic", "gap:10", "bg:[$surface]", "&hover(opacity:0.8)"
export type ZuzStyleToken = string;

// ─── Node variant discriminators ────────────────────────────────────────────
export type ZuzNodeType = "grid" | "component";

// Supported leaf component names (import surface of @zuzjs/ui)
export type ZuzComponentName =
    | "Box"
    | "Flex"
    | "Text"
    | "Icon"
    | "Button"
    | "Image"
    | "Span"
    | "Badge"
    | "Avatar"
    | "Label";

// Split operations that can transform an empty grid cell
export type SplitDirection = "2-col" | "3-col" | "4-col" | "2-row" | "3-row";

// ─── Core node ───────────────────────────────────────────────────────────────

/**
 * A single node in the ZuzBuilder recursive tree.
 *
 * Grid nodes  → rendered as <Flex> layout containers.
 * Component nodes → rendered as leaf @zuzjs/ui components.
 */
export interface ZuzNode {
    /** Stable unique identifier (nanoid / uuid) */
    id: string;

    /** Discriminator: layout container vs leaf component */
    type: ZuzNodeType;

    /**
     * Atomic shorthand tokens passed to the `as` prop.
     * Stored as a single space-joined string or a string array.
     * Examples: ["flex", "gap:16", "p:20", "aic"] or "flex gap:16 p:20 aic"
     */
    as?: ZuzStyleToken | ZuzStyleToken[];

    /**
     * Only present when type === "component".
     * Selects which @zuzjs/ui component to render.
     */
    component?: ZuzComponentName;

    /**
     * Additional component-specific props (text content, icon name, href, …).
     * Serialised as JSX attributes by the compiler.
     */
    props?: Record<string, unknown>;

    /**
     * Child nodes (grid cells, nested grids, or component children).
     * Leaf components may omit this.
     */
    children?: ZuzNode[];
}

// ─── Grid-specific extensions ────────────────────────────────────────────────

/**
 * Extended ZuzNode for grid containers.
 * Carries the column / row count so the compiler can emit the correct
 * CSS-grid `gtc:[repeat(N,1fr)]` shorthand.
 */
export interface ZuzGridNode extends ZuzNode {
    type: "grid";
    /** Number of explicit columns (default: 1 = block-level flow) */
    columns: number;
    /** Number of explicit rows; omit for auto rows */
    rows?: number;
}

// ─── Document tree ───────────────────────────────────────────────────────────

/** Top-level document tree managed by ZuzBuilder */
export interface ZuzTree {
    /** Document / page identifier */
    id: string;
    /** Human-readable page / template name */
    name: string;
    /** Single root grid node */
    root: ZuzNode;
}

// ─── Builder actions (used by reducer / state management) ────────────────────

export interface SplitAction {
    type: "SPLIT";
    /** id of the empty grid cell to transform */
    targetId: string;
    direction: SplitDirection;
}

export interface UpdateNodeAction {
    type: "UPDATE_NODE";
    targetId: string;
    patch: Partial<Pick<ZuzNode, "as" | "props" | "component">>;
}

export interface DeleteNodeAction {
    type: "DELETE_NODE";
    targetId: string;
}

export interface MoveNodeAction {
    type: "MOVE_NODE";
    sourceId: string;
    targetParentId: string;
    /** Index within the target parent's children array */
    index: number;
}

export type ZuzBuilderAction =
    | SplitAction
    | UpdateNodeAction
    | DeleteNodeAction
    | MoveNodeAction;

// ─── Code-generation options ─────────────────────────────────────────────────

export interface CompilerOptions {
    /**
     * List of @zuzjs/ui components to import.
     * Auto-detected by the compiler when omitted.
     */
    imports?: ZuzComponentName[];
    /** Indent string, defaults to two spaces */
    indent?: string;
    /** Name of the exported React component, defaults to "GeneratedPage" */
    componentName?: string;
}
