"use client"
import { createContext, FC, forwardRef, ReactNode, useImperativeHandle, useMemo, useRef, useState } from "react";
import { TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import Toast from "./toast";
import { ToastContextType, ToastController, ToastData, ToastType } from "./types";

export const ToastContext = createContext<ToastContextType | null>(null);

const ToastRenderer = forwardRef<ToastController>((props, ref) => {

    const [toasts, setToasts] = useState<ToastData[]>([]);
    
    const id = useRef(0)
    const nextId = () => ++id.current;

    useImperativeHandle(ref, () => ({
        add(toast: Omit<ToastData, 'id'>) {

            const toastId = nextId();
            const fullToast: ToastData = { id: toastId, ...toast };
            
            setToasts(prev => [fullToast, ...prev.slice(0, 4)]); // max 5

            if (toast.duration !== Infinity && toast.type != ToastType.Promise) {
                setTimeout(() => this.remove(toastId), ((toast.duration ?? 4) + 1) * 1000);
            }

            return toastId

        },
        remove(id: number) {
            setToasts(t => t.filter(toast => toast.id !== id));
        },
        clear(){
            setToasts([])
        }
    }))

    return <Box as={`--toast-wrapper rel`}>
        {toasts.map((toast, i) => <Toast key={`toast-${toast.id}`} index={i} {...toast} />)}
    </Box>
})

const ToastProvider: FC<{ 
    children: ReactNode,
    fx?: {
        curve: TRANSITION_CURVES,
        duration: number
    }
}> = forwardRef(({ children, fx }, ref) => {

    const toastController = useRef<ToastController>(null)



    const contextValue = useMemo(() => ({ 
        add:  (toast: Omit<ToastData, 'id'>) : number => toastController.current?.add(toast)!, 
        remove: (id: number) => toastController.current?.remove(id)!, 
        clear: () => toastController.current?.clear()!, 
        fx: fx || {
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.4
        }
    }), [toastController.current]);

    return <ToastContext.Provider value={contextValue}>
        { children }
        <ToastRenderer ref={toastController} />
    </ToastContext.Provider>

})

export default ToastProvider

