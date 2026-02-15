import { ReactNode, useContext } from "react";
import { DrawerProps } from "../comps";
import { LayersContext } from "../comps/Layers";
import { DrawerController } from "../types";
import { DRAWER_SIDE } from "../types/enums";

const useDrawer = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    const clearAll = () => ctx.clear()

    const hide = (id: number) => ctx.remove(id)

    const show = (pops : Omit<DrawerProps, `id` | `onShow` | `onHide`>) : DrawerController => {
        const id = ctx.add({ 
            type: `drawer`,
            props: pops
        })
        return {
            id,
            close: () => hide(id)
        }
    }

    return {
        clearAll,
        open: (
            child?: string | ReactNode | ReactNode[]
        ) => show({
            children: child
        }),
        right: (
            child?: string | ReactNode | ReactNode[]
        ) => show({
            children: child,
            from: DRAWER_SIDE.Right
        }),
        left: (
            child?: string | ReactNode | ReactNode[]
        ) => show({
            children: child,
            from: DRAWER_SIDE.Left
        }),
        top: (
            child?: string | ReactNode | ReactNode[]
        ) => show({
            children: child,
            from: DRAWER_SIDE.Top
        }),
        bottom: (
            child?: string | ReactNode | ReactNode[]
        ) => show({
            children: child,
            from: DRAWER_SIDE.Bottom
        }),
        close: hide
    }

}

export default useDrawer