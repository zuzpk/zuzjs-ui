"use client";
import { createContext, useCallback, useContext, useMemo, useRef, useSyncExternalStore } from "react";
import { dynamic } from "../../types";

interface FormStore {
    values: dynamic;
    errors: dynamic;
    touched: Record<string, boolean>;
}

interface FormContextValue {
    subscribe: (cb: () => void) => () => void;
    getSnapshot: () => FormStore;
    setFieldValue: (name: string, value: any) => void;
    setFieldError: (name: string, error: string | null) => void;
    reset: () => void;
}

const FormContext = createContext<FormContextValue | null>(null);

export const useFormStore = () => {
    const context = useContext(FormContext);
    if (!context) return null;
    return useSyncExternalStore(
        context.subscribe, 
        context.getSnapshot,
        context.getSnapshot
    );
};

export const useFormActions = () => useContext(FormContext);

// Internal Provider Component used by Form
export const FormProvider = ({ children, initialValues = {} }: { children: React.ReactNode, initialValues?: dynamic }) => {
    const store = useRef<FormStore>({ values: initialValues, errors: {}, touched: {} });
    const subscribers = useRef(new Set<() => void>());

    const getSnapshot = useCallback(() => store.current, []);
    const subscribe = useCallback((cb: () => void) => {
        subscribers.current.add(cb);
        return () => subscribers.current.delete(cb);
    }, []);

    const notify = () => subscribers.current.forEach(cb => cb());

    const actions = useMemo(() => ({
        subscribe,
        getSnapshot,
        setFieldValue: (name: string, value: any) => {
            if (store.current.values[name] === value) return;
            store.current.values = { ...store.current.values, [name]: value };
            notify();
        },
        setFieldError: (name: string, error: string | null) => {
            store.current.errors = { ...store.current.errors, [name]: error };
            notify();
        },
        reset: () => {}
    }), [subscribe, getSnapshot]);

    return <FormContext.Provider value={actions}>{children}</FormContext.Provider>;
};