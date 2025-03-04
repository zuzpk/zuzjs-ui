import SVGIcons from "../svgicons";
declare const Fab: import("react").ForwardRefExoticComponent<Omit<import("..").ButtonProps, "icon"> & {
    icon?: string | keyof typeof SVGIcons;
    position?: `${import("../..").Position.Top | import("../..").Position.Bottom}${import("../..").Position.Left | import("../..").Position.Right}`;
} & import("react").RefAttributes<HTMLButtonElement>>;
export default Fab;
