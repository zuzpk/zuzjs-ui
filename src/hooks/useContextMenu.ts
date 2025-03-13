'use client'
import { MouseEvent, Ref, RefObject, useEffect } from "react";
import { ContextItem, ContextMenuHandler } from "../comps";

const useContextMenu = (menu: RefObject<ContextMenuHandler | null>) => {

    const show = (e : MouseEvent<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            menu.current?.show(e as any, items);
        }, 0);
    }

    const hide = (e : MouseEvent | TouchEvent) => {
        menu.current?.hide(e);
    }

    useEffect(() => {
        document.addEventListener("click", hide as EventListener);
        return () => {
            document.removeEventListener("click", hide as EventListener);
        }
    }, [menu])

    return { show, hide };

}

export default useContextMenu;