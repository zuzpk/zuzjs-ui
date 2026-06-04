import { ReactNode, useContext } from "react";
import { DrawerProps } from "../comps";
import { LayersContext } from "../comps/Layers";
import { DrawerController } from "../types";
import { DRAWER_SIDE } from "../types/enums";

type DrawerOptions = Omit<DrawerProps, 'id' | 'onShow' | 'onHide' | 'from' | 'children'>

const useDrawer = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    const clearAll = () => ctx.clear(`drawer`)

    const hide = (id: number) => ctx.remove(id)

    const setLoading = (id: number, mode: boolean) => ctx.loading(id, mode)

    const setDirty = (id: number, dirty: boolean) => ctx.update(id, { dirty })

    const show = (pops : Omit<DrawerProps, `id` | `onShow` | `onHide`>) : DrawerController => {
        const id = ctx.add({ 
            type: `drawer`,
            props: pops
        })
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