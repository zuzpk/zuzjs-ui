import { FC, MouseEvent as ReactMouseEvent, ReactNode, RefObject, useContext } from "react";
import { ContextItem, ContextMenuArrowAlign, ContextMenuArrowSide } from "../comps/ContextMenu/types";
import { LayersContext } from "../comps/Layers";
import { ORIGIN, TRANSITION_CURVES, TRANSITIONS, ValueOf } from "../types";

const useContextMenu = () => {
    const ctx = useContext(LayersContext);
    if (!ctx) throw new Error('useContextMenu must be used inside <LayersProvider>');

    // For Right Click
    const showContextMenu = (
        e: ReactMouseEvent<Element, MouseEvent> | TouchEvent, 
        items: ContextItem[],
        origin?: ValueOf<typeof ORIGIN>,
        width?: number | string,
        onClose?: (id: number) => void
    ) => {
        e.preventDefault();
        ctx.openMenu({ 
            event: e, 
            items,
            origin,
            width,
            onClose
        });
    };

    // For Dropdown Buttons
    const showMenu = (ref: RefObject<HTMLElement | null>, {
        items, 
        origin, 
        offsetX, 
        offsetY, 
        transition, 
        curve, 
        arrow,
        arrowSide,
        arrowAlign,
        duration,
        header,
        footer,
        width,
        onClose,
    } : {
        transition?: ValueOf<typeof TRANSITIONS>,
        curve?: ValueOf<typeof TRANSITION_CURVES>,
        arrow?: boolean,
        arrowSide?: ContextMenuArrowSide,
        arrowAlign?: ContextMenuArrowAlign,
        duration?: number,
        offsetX?: number,
        offsetY?: number,
        items: ContextItem[],
        origin?: ValueOf<typeof ORIGIN>,
        header?: ReactNode | FC,
        footer?: ReactNode | FC,
        width?: number | string,
        onClose?: (id: number) => void
    }) => {
        ctx.openMenu({ 
            fx: {
                transition,
                curve,
                duration
            },
            parent: ref, 
            items,
            origin: origin || ORIGIN.TopCenter,
            offsetX, offsetY, arrow, arrowSide, arrowAlign,
            header,
            footer,
            width,
            onClose
        });
    };

    return { showContextMenu, showMenu, hide: ctx.clear };
};

export default useContextMenu