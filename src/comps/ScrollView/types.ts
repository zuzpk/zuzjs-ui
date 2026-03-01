import { ScrollBreakpoint } from "@zuzjs/hooks";
import { CSSProperties } from "react";
import { BoxProps } from "../../types/interfaces";

export type ScrollViewProps = BoxProps & {
    style?: CSSProperties,
    speed?: number,
    smooth?: boolean,
    breakpoints?: ScrollBreakpoint
}