import { ReactNode, useContext } from "react";
import { TRANSITION_CURVES, TRANSITIONS, ValueOf } from "../types";
import { DRAWER_SIDE } from "../types/enums"
import { LayersContext } from "../comps/Layers";
import { DrawerProps } from "../comps";

const useDrawer = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    const clearAll = () => ctx.clear()

    const hide = (id: number) => ctx.remove(id)

    const show = (pops : Omit<DrawerProps, `id` | `onShow` | `onHide`>) =>
        ctx.add({ 
            type: `drawer`,
            props: pops
        })

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