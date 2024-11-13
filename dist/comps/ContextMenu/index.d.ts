import { BoxProps } from "../Box";
import { ContextMenuHandler } from "./types";
declare const ContextMenu: import("react").ForwardRefExoticComponent<BoxProps & {
    items: import("./types").ContextItem[];
} & import("react").RefAttributes<ContextMenuHandler>>;
export default ContextMenu;
