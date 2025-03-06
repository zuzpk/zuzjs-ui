'use client';
import { useEffect } from "react";
const useContextMenu = (menu) => {
    const show = (e, items) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            menu.current?.show(e, items);
        }, 0);
    };
    const hide = (e) => {
        menu.current?.hide(e);
    };
    useEffect(() => {
        document.addEventListener("click", hide);
        return () => {
            document.removeEventListener("click", hide);
        };
    }, [menu]);
    return { show, hide };
};
export default useContextMenu;
