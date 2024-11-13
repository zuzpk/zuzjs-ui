import { Ref, RefObject, useEffect } from "react";
import { ContextMenuHandler } from "../comps";

const useContextMenu = (menu: RefObject<ContextMenuHandler>) => {

    const show = (e : MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        menu.current?.show(e);
    }

    const hide = (e : MouseEvent | TouchEvent) => {
        menu.current?.hide(e);
    }

    useEffect(() => {
        document.addEventListener("mousedown", hide);
        document.addEventListener("touchstart", hide);
        return () => {
            document.removeEventListener("mousedown", hide);
            document.removeEventListener("touchstart", hide);
        }
    }, [menu])

    return { show, hide };

}

export default useContextMenu;