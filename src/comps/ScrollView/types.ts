import { CSSProperties } from "react";
import { BoxProps } from "../../types/interfaces";

export type ScrollViewProps = BoxProps & {
    style?: CSSProperties,
    speed?: number,
}