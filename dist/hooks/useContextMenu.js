import { useEffect } from "react";
const useContextMenu = (menu) => {
    const show = (e, items) => {
        e.preventDefault();
        e.stopPropagation();
        menu.current?.show(e, items);
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
