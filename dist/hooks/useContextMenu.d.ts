import { RefObject } from "react";
import { ContextItem, ContextMenuHandler } from "../comps";
declare const useContextMenu: (menu: RefObject<ContextMenuHandler>) => {
    show: (e: MouseEvent, items?: ContextItem[]) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
};
export default useContextMenu;
