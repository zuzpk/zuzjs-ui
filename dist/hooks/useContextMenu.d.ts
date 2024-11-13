import { RefObject } from "react";
import { ContextMenuHandler } from "../comps";
declare const useContextMenu: (menu: RefObject<ContextMenuHandler>) => {
    show: (e: MouseEvent) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
};
export default useContextMenu;
