import { MouseEvent as ReactMouseEvent, RefObject, useContext } from "react";
import { LayersContext } from "../comps/Layers";
import { ContextItem } from "../comps";
import { ORIGIN, ValueOf } from "../types";

const useContextMenu = () => {
    const ctx = useContext(LayersContext);
    if (!ctx) throw new Error('useContextMenu must be used inside <ThemeProvider>');

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
    const showMenu = (
        ref: RefObject<HTMLElement | null>, 
        items: ContextItem[],
        origin?: ValueOf<typeof ORIGIN>
    ) => {
        ctx.openMenu({ 
            parent: ref, 
            items,
            origin: origin || ORIGIN.TopCenter
        });
    };

    return { showContextMenu, showMenu, hide: ctx.clear };
};

export default useContextMenu