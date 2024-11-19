import { BoxProps } from "../Box";
import { ContextItem, ContextMenuHandler } from "./types";
declare const ContextMenu: import("react").ForwardRefExoticComponent<BoxProps & {
    items?: ContextItem[];
} & import("react").RefAttributes<ContextMenuHandler>>;
export default ContextMenu;
