import { ValueOf } from "../../types";
import { Position } from "../../types/enums";
import { ButtonProps } from "../Button/types";
import SVGIcons from "../svgicons";


export type FabProps = Omit<ButtonProps, `icon`> & {
    icon?: string | keyof typeof SVGIcons,
    position?: ValueOf<typeof Position>
    // position?: ValueOf<typeof `${Position.Top | Position.Bottom}${Position.Left | Position.Right}`>
}