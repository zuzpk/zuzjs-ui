import { CSSProperties } from "react";
import { BoxProps } from "../Box";
export type ScrollViewProps = BoxProps & {
    style?: CSSProperties;
    speed?: number;
};
