import { useEffect } from "react";
const useContextMenu = (menu) => {
    const show = (e) => {
        e.preventDefault();
        e.stopPropagation();
        menu.current?.show(e);
    };
    const hide = (e) => {
        menu.current?.hide(e);
    };
    useEffect(() => {
        document.addEventListener("mousedown", hide);
        document.addEventListener("touchstart", hide);
        return () => {
            document.removeEventListener("mousedown", hide);
            document.removeEventListener("touchstart", hide);
        };
    }, [menu]);
    return { show, hide };
};
export default useContextMenu;
