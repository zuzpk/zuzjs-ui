import { DragType } from "@zuzjs/hooks";
import { CSSProperties, ReactNode } from "react";
import { Props, ValueOf } from "../../types";
import { TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import { animationProps } from "../../types/interfaces";

export type ListItemObject = {
    icon?: ReactNode,
    label?: ReactNode,
    action?: ReactNode,
    className?: string,
    animate?: animationProps,
    onClick?: (event: any) => void,
}

export type ListItemMeta = Props<`li`> & ListItemObject

export type ListItem = ReactNode | ListItemMeta

export type ListRenderContext = {
    index: number,
    isDragging: boolean,
    isOver: boolean,
    canReceive: boolean,
    highlighted: boolean,
}

export type ListRender<T = ListItem> = (item: T, context: ListRenderContext) => ReactNode

export type VirtualScrollOptions = {
    /** Height of each item in pixels */
    itemHeight?: number;
    /** Container height in pixels (auto-detected if not provided) */
    height?: number;
    /** Number of items to render outside visible area */
    overscan?: number;
}

export type ListProps = Props<`ul` | `ol`> & {
    /** Visual variant (size) */
    variant?: ValueOf<typeof Variant>,
    /** Array of items to render (ReactNode or ListItemMeta) */
    items: ListItem[],
    /** Layout direction: "cols" (default) or "rows" */
    direction?: "cols" | "rows",
    /** Separator element between items */
    seperator?: ReactNode,
    /** Render as <ol> instead of <ul> */
    ol?: boolean,
    /** Enable sortable drag-and-drop reordering within the list */
    sortable?: boolean,
    /** Allow individual items to be dragged */
    itemDraggable?: boolean,
    /** Allow individual items to be drop targets */
    itemDroppable?: boolean,
    /** DnD channel (default: "__zuz_ui_list_item__"). For cross-list dragging, use the same channel on all lists */
    dragChannel?: DragType,
    /** Delay before drag starts in milliseconds (0 = instant) */
    dragDelay?: number,
    /** Visual mode while dragging: "self" (move element + show placeholder) or "clone" (fade + show ghost) */
    ghostMode?: "self" | "clone",
    /** Duration of drop highlight animation in ms */
    dropHighlightDuration?: number,
    /** Drop highlight animation type (ScaleIn, SlideIn*, FadeIn) */
    dropHighlightTransition?: ValueOf<typeof TRANSITIONS>,
    /** Drop highlight animation curve (Spring, Ease, Linear, etc.) */
    dropHighlightCurve?: ValueOf<typeof TRANSITION_CURVES>,
    /** Custom render function for list items (signature: (item, context) => ReactNode) */
    render?: ListRender<any>,
    /** Content to display when list is empty (string, ReactNode, or custom message) */
    empty?: ReactNode,
    /** Callback when items are reordered. For cross-list moves, handle items leaving/entering other lists here */
    onSort?: (items: ListItem[], context: { from: number, to: number, item: ListItem }) => void,
    /** Virtual scrolling config for large lists */
    virtual?: VirtualScrollOptions,
    /** CSS list-style property */
    listStyle?: CSSProperties[`listStyle`] | string,
}