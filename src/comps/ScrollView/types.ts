import { ScrollBreakpoint } from "@zuzjs/hooks";
import { CSSProperties, UIEvent } from "react";
import { BoxProps } from "../../types/interfaces";

export type ScrollViewDirection = 'both' | 'vertical' | 'horizontal';

export type ScrollViewProps = BoxProps & {
    style?: CSSProperties,
    speed?: number,
    smooth?: boolean,
    breakpoints?: ScrollBreakpoint,
    direction?: ScrollViewDirection,
    onScroll?: (event: UIEvent<HTMLDivElement>) => void,
    /**
     * Auto-scroll to bottom when content changes.
     * Set to 'smooth' for smooth scrolling, or true for instant scrolling.
     * @default false
     */
    autoScrollToBottom?: boolean | 'smooth',
}