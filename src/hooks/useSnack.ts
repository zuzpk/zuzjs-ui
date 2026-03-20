"use client"
import { useContext } from "react";
// import { ToastContext } from "../comps/Toast";
import { LayersContext } from "../comps/Layers";
import { SnackAction, SnackPosition, SnackStyle, SnackType, ToastProps } from "../comps/Toast/types";

interface SnackProps {
    title: string, 
    message?: string, 
    icon?: string, 
    duration?: number,
    sticky?: boolean,
    position?: SnackPosition,
    style?: SnackStyle,
    actions?: SnackAction[],
    progress?: boolean,
    progressValue?: number,
    width?: number | string;
}

interface SnackBtn {
    label?: string;
    onClick?: () => void;
}

type SnackPatch = Partial<Omit<ToastProps, 'id' | 'onClose'>>;

export interface SnackController {
    id: number;
    update: (props: SnackPatch) => void;
    setType: (type: SnackType) => void;
    setProgress: (progress: number) => void;
    setBusy: (busy: boolean) => void;
    success: () => void;
    error: () => void;
    warn: () => void;
    promise: () => void;
    default: () => void;
    hide: () => void;
}

const useSnack = () => {

    const ctx = useContext(LayersContext);

    if (!ctx) throw new Error('useToast must be used inside <LayersProvider>');

    const base = (type: ToastProps['type'], data: Omit<ToastProps, 'id' | 'type'>) => ctx.add({ 
        type: `toast`,
        props: { ...data, type }
    })

    const clearAll = () => ctx.clear(`toast`)

    const hide = (id: number) => ctx.remove(id)

    const update = (id: number, props: SnackPatch) => ctx.update(id, props)

    const toController = (id: number): SnackController => ({
        id,
        update: (props) => update(id, props),
        setType: (type) => update(id, { type }),
        setProgress: (progress) => update(id, { progress: true, progressValue: progress }),
        setBusy: (busy) => update(id, { busy }),
        success: () => update(id, { type: SnackType.Success }),
        error: () => update(id, { type: SnackType.Error }),
        warn: () => update(id, { type: SnackType.Warn }),
        promise: () => update(id, { type: SnackType.Promise }),
        default: () => update(id, { type: SnackType.Default }),
        hide: () => hide(id),
    })

    const show = (props : SnackProps) => toController(base(SnackType.Default, props));

    const success = (props : SnackProps) => toController(base(SnackType.Success, props));

    const error = (props : SnackProps) => toController(base(SnackType.Error, props));

    const warn = (props : SnackProps) => toController(base(SnackType.Warn, props));

    const promise = (props : SnackProps) => toController(base(SnackType.Promise, props));

    // Internal Helper for OK button
    const okBase = (type: SnackType, props: SnackProps, ok?: SnackBtn) => {
        const id = base(type, {
            ...props,
            sticky: props.sticky ?? false,
            actions: [
                {
                    label: ok?.label || "Ok",
                    onClick: () => {
                        ok?.onClick?.();
                        hide(id);
                    }
                }
            ]
        });
        return toController(id);
    };

    // Internal Helper for Confirm buttons
    const confirmBase = (
        type: SnackType, 
        props: SnackProps, 
        ok?: SnackBtn, 
        cancel?: SnackBtn
    ) => {
        const id = base(type, {
            ...props,
            sticky: true,
            actions: [
                {
                    label: cancel?.label || "Cancel",
                    onClick: () => {
                        cancel?.onClick?.();
                        hide(id);
                    }
                },
                {
                    label: ok?.label || "Ok",
                    onClick: () => {
                        ok?.onClick?.();
                        hide(id);
                    }
                }
            ]
        });
        return toController(id);
    };

    return {
        show,
        hide,
        promise,
        clearAll,

        // Direct Action Methods
        ok: (props: SnackProps, ok?: SnackBtn) =>
            okBase(SnackType.Default, props, ok),

        success: (props: SnackProps, ok?: SnackBtn) =>
            ok ? okBase(SnackType.Success, props, ok) : success(props),

        error: (props: SnackProps, ok?: SnackBtn) =>
            ok ? okBase(SnackType.Error, props, ok) : error(props),

        confirm: (props: SnackProps, ok?: SnackBtn, cancel?: SnackBtn) =>
            confirmBase(SnackType.Default, props, ok, cancel),

        warn: (props: SnackProps, ok?: SnackBtn) =>
            ok ? okBase(SnackType.Warn, props, ok) : warn(props),
        // Alias to support typo-prone calls like snack.succes(...)
        succes: (props: SnackProps, ok?: SnackBtn) =>
            ok ? okBase(SnackType.Success, props, ok) : success(props),
        // warn: (props: SnackProps, ok?: SnackBtn, cancel?: SnackBtn) => 
        //     confirmBase(SnackType.Warn, props, ok, cancel),
    }

}

export default useSnack