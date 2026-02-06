"use client"
import { useContext } from "react";
import { ToastContext } from "../comps/Toast";
import { ToastData, ToastType } from "../comps/Toast/types";

const useToast = () => {

    const ctx = useContext(ToastContext);

    if (!ctx) throw new Error('useToast must be used inside <ToastProvider>');

    const base = (type: ToastData['type'], data: Omit<ToastData, 'id' | 'type'>) => ctx.add({ ...data, type })

    const clearAll = () => ctx.clear()

    const hide = (id: number) => ctx.remove(id)

    const show = (title: string, message?: string, icon?: string, duration?: number) =>
        base(ToastType.Default, { title, message, icon, duration });

    const success = (title: string, message?: string, icon?: string, duration?: number) =>
        base(ToastType.Success, { title, message, icon, duration });

    const error = (title: string, message?: string, icon?: string, duration?: number) =>
        base(ToastType.Error, { title, message, icon, duration });

    const warn = (title: string, message?: string, icon?: string, duration?: number) =>
        base(ToastType.Warn, { title, message, icon, duration });

    const promise = (title: string, message?: string, icon?: string, duration?: number) =>
        base(ToastType.Promise, { title, message, icon, duration });

    return { show, hide, success, error, warn, promise, clearAll }

}

export default useToast