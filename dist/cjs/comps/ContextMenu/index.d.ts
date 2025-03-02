import { BoxProps } from "../Box";
import { ContextItem, ContextMenuHandler } from "./types";
declare const ContextMenu: import("react").ForwardRefExoticComponent<BoxProps & {
    parent?: HTMLElement;
    items?: ContextItem[];
    offsetX?: number;
    offsetY?: number;
} & import("react").RefAttributes<ContextMenuHandler>>;
export default ContextMenu;
