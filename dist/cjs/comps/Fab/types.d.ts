import { Position } from "../../types/enums";
import { ButtonProps } from "../Button/types";
import SVGIcons from "../svgicons";
export type FabProps = Omit<ButtonProps, `icon`> & {
    icon?: string | keyof typeof SVGIcons;
    position?: `${Position.Top | Position.Bottom}${Position.Left | Position.Right}`;
};
