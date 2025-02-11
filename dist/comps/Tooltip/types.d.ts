import { Position } from "../../types/enums";
import { BoxProps } from "../Box";
export type ToolTipProps = BoxProps & {
    position?: Position;
    margin?: number;
};
