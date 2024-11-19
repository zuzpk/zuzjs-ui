import { Ref, RefObject, useEffect } from "react";
import { ContextItem, ContextMenuHandler } from "../comps";

const useContextMenu = (menu: RefObject<ContextMenuHandler>) => {

    const show = (e : MouseEvent, items?: ContextItem[]) => {
        e.preventDefault();
        e.stopPropagation();
        menu.current?.show(e, items);
    }

    const hide = (e : MouseEvent | TouchEvent) => {
        menu.current?.hide(e);
    }

    useEffect(() => {
        document.addEventListener("click", hide);
        return () => {
            document.removeEventListener("click", hide);
        }
    }, [menu])

    return { show, hide };

}

export default useContextMenu;