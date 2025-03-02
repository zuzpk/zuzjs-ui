import { MouseEvent, RefObject } from "react";
import { ContextItem, ContextMenuHandler } from "../comps";
declare const useContextMenu: (menu: RefObject<ContextMenuHandler | null>) => {
    show: (e: MouseEvent<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
};
export default useContextMenu;
