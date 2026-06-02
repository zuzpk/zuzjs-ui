import { ReactNode } from "react";
import { BoxProps, POSITION, ValueOf, Variant } from "../../types";

export interface ToolTipController {
    setPosition: (pos: { x: number, y: number }) => void;
    show: () => void;
    hide: () => void;
}

export type ToolTipTransition = `slide` | `scale` | `none`

export type ToolTipProps = Omit<BoxProps, `title` | `ref` | `transition`> & {
    position?: ValueOf<typeof POSITION>;
    margin?: number;
    title?: string | ReactNode;
    show?: boolean;
    variant?: ValueOf<typeof Variant>;
    /** Tooltip will be anchored to this className in children */
    anchorName?: string,
    transition?: ToolTipTransition;
}