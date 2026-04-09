import { ReactNode } from "react";
import { Props, ValueOf } from "../../types";
import { Variant } from "../../types/enums";
import { animationProps } from "../../types/interfaces";

export type ListItemObject = {
    icon?: ReactNode,
    label?: ReactNode,
    action?: ReactNode,
    className?: string,
    animate?: animationProps,
    onClick?: (event: any) => void,
}

export type ListItem = Props<`li`> & (ReactNode | ListItemObject)

export type VirtualScrollOptions = {
    /** Height of each item in pixels */
    itemHeight?: number;
    /** Container height in pixels (auto-detected if not provided) */
    height?: number;
    /** Number of items to render outside visible area */
    overscan?: number;
}

export type ListProps = Props<`ul` | `ol`> & {
    variant?: ValueOf<typeof Variant>,
    items: ListItem[],
    direction?: "cols" | "rows",
    seperator?: ReactNode,
    ol?: boolean,
    /** Virtual scrolling config for large lists */
    virtual?: VirtualScrollOptions,
}