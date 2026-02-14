import { useContext } from "react";
import { DialogProps } from "../comps/Dialog/types";
import { LayersContext } from "../comps/Layers";
import { DIALOG } from "../types";

const useDialog = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    const clearAll = () => ctx.clear()

    const hide = (id: number) => ctx.remove(id)

    const show = (pops : Omit<DialogProps, `id` | `onShow` | `onHide`>) : {
        id: number;
        hide: () => void
    } => {
        const id = ctx.add({ 
            type: `dialog`,
            props: { ...pops, type: DIALOG.Dialog }
        })
        return {
            id,
            hide: () => hide(id)
        }
    }

    return {
        clearAll,
        show,
        hide
    }

}
// const useDialog = () => {

//     const ctx = useContext(DialogContext);

//     if (!ctx) throw new Error('useDialog must be used inside <DialogProvider>');

//     const base = (type: DialogProps['type'], data: Omit<DialogProps, `id` | `onShow` | `onHide`>) => ctx.add({ ...data, type })

//     const clearAll = () => ctx.clear()

//     const hide = (id: number) => ctx.remove(id)

//     const show = (pops : Omit<DialogProps, `id` | `onShow` | `onHide`>) =>
//         base(DIALOG.Dialog, pops);

//     return {
//         clearAll,
//         show,
//         hide
//     }

// }

export default useDialog