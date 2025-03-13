"use client"
import { MouseEvent, RefObject, useEffect } from "react";
import { SheetHandler } from "../comps";

const useSheet = (sheet: RefObject<SheetHandler | null>) => {

    const show = (e : MouseEvent<Element, MouseEvent> | TouchEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(() => {
            sheet.current?.show(e as any);
        }, 0);
    }
    
    const hide = (e : MouseEvent | TouchEvent) => {
        sheet.current?.hide();
    }

    useEffect(() => {
        document.addEventListener("click", hide as EventListener);
        return () => {
            document.removeEventListener("click", hide as EventListener);
        }
    }, [sheet])

    return { show, hide };

}

export default useSheet;