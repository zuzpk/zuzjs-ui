/**
 * @zuzjs/ui – Visual Builder Engine
 *
 * Public surface for the ZuzBuilder ecosystem.
 *
 * @example
 * ```ts
 * // Types / interfaces
 * import type { ZuzNode, ZuzTree, ZuzGridNode } from "@zuzjs/ui/src/builder/visual";
 *
 * // Compiler (no React, safe for server / Node)
 * import { generatePageSource, generateFragment } from "@zuzjs/ui/src/builder/visual";
 *
 * // React components (client-only)
 * import { ZuzBuilder, VisualCanvas, createBlankTree } from "@zuzjs/ui/src/builder/visual";
 * ```
 */

// ── Types ────────────────────────────────────────────────────────────────────
export type {
    CompilerOptions, DeleteNodeAction,
    MoveNodeAction,
    SplitAction,
    SplitDirection,
    UpdateNodeAction, ZuzBuilderAction,
    ZuzComponentName,
    ZuzGridNode,
    ZuzNode,
    ZuzNodeType,
    ZuzStyleToken,
    ZuzTree
} from "./zuz-node";

// ── Compiler (no React, safe for server / Node) ──────────────────────────────
export { generateFragment, generatePageSource } from "./compiler";

// ── React components (client-only) ───────────────────────────────────────────
export { VisualCanvas } from "./visual-canvas";
export type { VisualCanvasProps } from "./visual-canvas";

export { createBlankTree, ZuzBuilder } from "./zuz-builder";
export type { ZuzBuilderProps } from "./zuz-builder";

