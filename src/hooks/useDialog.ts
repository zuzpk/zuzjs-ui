import { ReactNode, useContext } from "react";
import { DialogActionHandler, DialogProps } from "../comps/Dialog/types";
import { DIALOG, TRANSITION_CURVES, TRANSITIONS, ValueOf } from "../types";
import { LayersContext } from "../comps/Layers";

const useDialog = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <ThemeProvider>');

    const clearAll = () => ctx.clear()

    const hide = (id: number) => ctx.remove(id)

    const show = (pops : Omit<DialogProps, `id` | `onShow` | `onHide`>) =>
        ctx.add({ 
            type: `dialog`,
            props: { ...pops, type: DIALOG.Dialog }
        })

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