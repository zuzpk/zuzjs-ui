import SVGIcons from "../svgicons";
import { Position } from "../../types/enums";
declare const Fab: import("react").ForwardRefExoticComponent<Omit<import("..").ButtonProps, "icon"> & {
    icon?: string | keyof typeof SVGIcons;
    position?: `${Position.Top | Position.Bottom}${Position.Left | Position.Right}`;
} & import("react").RefAttributes<HTMLButtonElement>>;
export default Fab;
