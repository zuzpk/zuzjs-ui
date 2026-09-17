import { ReactNode, useContext, useRef } from "react";
import { DrawerProps } from "../comps";
import { LayersContext } from "../comps/Layers";
import { DrawerController } from "../types";
import { DRAWER_SIDE } from "../types/enums";

type DrawerOptions = Omit<DrawerProps, 'id' | 'onShow' | 'onHide' | 'from' | 'children'>

const useDrawer = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    // Track last drawer ID for convenience close
    const lastDrawerIdRef = useRef<number | null>(null);

    const clearAll = () => ctx.clear(`drawer`)

    /**
     * Hide drawer by ID or hide last drawer if no ID provided
     * @param id - Optional drawer ID. If not provided, hides the last drawer
     */
    const hide = (id?: number) => {
        if (id !== undefined) {
            ctx.remove(id)
            // Clear ref if closing the tracked drawer
            if (lastDrawerIdRef.current === id) {
                lastDrawerIdRef.current = null;
            }
        } else if (lastDrawerIdRef.current !== null) {
            ctx.remove(lastDrawerIdRef.current)
            lastDrawerIdRef.current = null;
        }
    }

    const setLoading = (id: number, mode: boolean) => ctx.loading(id, mode)

    const setDirty = (id: number, dirty: boolean) => ctx.update(id, { dirty })

    const show = (pops : Omit<DrawerProps, `id` | `onShow` | `onHide`>) : DrawerController => {
        const id = ctx.add({ 
            type: `drawer`,
            props: pops
        })
        // Track the last opened drawer
        lastDrawerIdRef.current = id;
        
        return {
            id,
            setLoading: (mod) => setLoading(id, mod),
            setDirty: (dirty) => setDirty(id, dirty),
            close: () => hide(id)
        }
    }

    return {
        clearAll,
        open: (
            child?: string | ReactNode | ReactNode[],
            options?: DrawerOptions
        ) => show({
            children: child,
            ...options
        }),
        right: (
            child?: string | ReactNode | ReactNode[],
            options?: DrawerOptions
        ) => show({
            children: child,
            from: DRAWER_SIDE.Right,
            ...options
        }),
        left: (
            child?: string | ReactNode | ReactNode[],
            options?: DrawerOptions
        ) => show({
            children: child,
            from: DRAWER_SIDE.Left,
            ...options
        }),
        top: (
            child?: string | ReactNode | ReactNode[],
            options?: DrawerOptions
        ) => show({
            children: child,
            from: DRAWER_SIDE.Top,
            ...options
        }),
        bottom: (
            child?: string | ReactNode | ReactNode[],
            options?: DrawerOptions
        ) => show({
            children: child,
            from: DRAWER_SIDE.Bottom,
            ...options
        }),
        close: hide
    }

}

export default useDrawer
