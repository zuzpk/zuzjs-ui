import { FC, MouseEvent as ReactMouseEvent, ReactNode, RefObject, useContext } from "react";
import { ContextItem } from "../comps/ContextMenu/types";
import { LayersContext } from "../comps/Layers";
import { ORIGIN, TRANSITION_CURVES, TRANSITIONS, ValueOf } from "../types";

const useContextMenu = () => {
    const ctx = useContext(LayersContext);
    if (!ctx) throw new Error('useContextMenu must be used inside <LayersProvider>');

    // For Right Click
    const showContextMenu = (
        e: ReactMouseEvent<Element, MouseEvent> | TouchEvent, 
        items: ContextItem[],
        origin?: ValueOf<typeof ORIGIN>
    ) => {
        e.preventDefault();
        ctx.openMenu({ 
            event: e, 
            items,
            origin
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
        duration,
        header,
        footer
    } : {
        transition?: ValueOf<typeof TRANSITIONS>,
        curve?: ValueOf<typeof TRANSITION_CURVES>,
        arrow?: boolean,
        duration?: number,
        offsetX?: number,
        offsetY?: number,
        items: ContextItem[],
        origin?: ValueOf<typeof ORIGIN>,
        header?: ReactNode | FC,
        footer?: ReactNode | FC,
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
            offsetX, offsetY, arrow,
            header,
            footer
        });
    };

    return { showContextMenu, showMenu, hide: ctx.clear };
};

export default useContextMenu