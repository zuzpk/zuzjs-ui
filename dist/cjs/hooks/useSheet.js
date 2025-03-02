import { useEffect } from "react";
const useSheet = (sheet) => {
    const show = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            sheet.current?.show(e);
        }, 0);
    };
    const hide = (e) => {
        sheet.current?.hide();
    };
    useEffect(() => {
        document.addEventListener("click", hide);
        return () => {
            document.removeEventListener("click", hide);
        };
    }, [sheet]);
    return { show, hide };
};
export default useSheet;
