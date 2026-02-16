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
    actions?: SnackAction[]
}

interface SnackBtn {
    label?: string;
    onClick?: () => void;
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

    const show = (props : SnackProps) => base(SnackType.Default, props);

    const success = (props : SnackProps) => base(SnackType.Success, props);

    const error = (props : SnackProps) => base(SnackType.Error, props);

    const warn = (props : SnackProps) => base(SnackType.Warn, props);

    const promise = (props : SnackProps) => base(SnackType.Promise, props);

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
        return id;
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
        return id;
    };

    return { 
        // show, 
        // hide, 
        // success, 
        // error, 
        // warn, 
        // promise, 
        
        // Direct Action Methods
        ok: (props: SnackProps, ok?: SnackBtn) => 
            okBase(SnackType.Default, props, ok),

        success: (props: SnackProps, ok?: SnackBtn) => 
            okBase(SnackType.Success, props, ok),

        error: (props: SnackProps, ok?: SnackBtn) => 
            okBase(SnackType.Error, props, ok),

        confirm: (props: SnackProps, ok?: SnackBtn, cancel?: SnackBtn) => 
            confirmBase(SnackType.Default, props, ok, cancel),

        warn: (props: SnackProps, ok?: SnackBtn) => 
            okBase(SnackType.Warn, props, ok),
        // warn: (props: SnackProps, ok?: SnackBtn, cancel?: SnackBtn) => 
        //     confirmBase(SnackType.Warn, props, ok, cancel),
    }

}

export default useSnack