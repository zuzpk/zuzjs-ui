import { dynamic } from "@zuzjs/core";
import { useContext } from "react";
import { DialogProps } from "../comps/Dialog/types";
import { LayersContext } from "../comps/Layers";
import { DIALOG, DialogController } from "../types";

const useDialog = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useDialog must be used inside <LayersProvider>');

    const clearAll = () => ctx.clear(`dialog`)

    const hide = (id: number) => ctx.remove(id)

    const setLoading = (id: number, mode: boolean) => ctx.loading(id, mode)

    const show = (pops : Omit<DialogProps, `id` | `onShow` | `onHide`>) : DialogController => {
        const id = ctx.add({ 
            type: `dialog`,
            props: { ...pops, type: DIALOG.Dialog }
        })
        return {
            id,
            setLoading: (mod) => setLoading(id, mod),
            hide: () => hide(id)
        }
    }

    const confirm = (pops : Omit<DialogProps, `id` | `onShow` | `onHide`> & {
        confirmLabel?: string,
        cancelLabel?: string,
    }) : DialogController => {
        const id = ctx.add({ 
            type: `dialog`,
            props: { 
                ...pops, 
                type: DIALOG.Confirm,
                action: pops.action ?? [
                    { 
                        label: pops.cancelLabel ?? `Cancel`, 
                        kind: `ghost`,
                        onClick: () => {
                            pops.onCancel?.();
                            hide(id);
                        }
                    }, 
                    { 
                        label: pops.confirmLabel ?? `Confirm`, 
                        kind: `solid`,
                        type: `submit`,
                        onClick: (data?: dynamic) => {
                            pops.onConfirm?.(data);
                        }
                    }
                ]
            }
        })
        return {
            id,
            setLoading: (mod) => setLoading(id, mod),
            hide: () => hide(id)
        }
    }

    return {
        clearAll,
        show,
        confirm,
        hide
    }

}

export default useDialog