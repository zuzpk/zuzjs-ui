import { BoxProps } from "../Box";
export declare enum TOOLTIP {
    Top = "top",
    Bottom = "bottom",
    Left = "left",
    Right = "right"
}
export type ToolTipProps = BoxProps & {
    dir?: TOOLTIP;
};
