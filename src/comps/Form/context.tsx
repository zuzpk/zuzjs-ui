"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
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
    deleteFieldValue: (name: string) => void;
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

export const useForm = () => {
    const actions = useFormActions()
    const store = useFormStore()
    return {
        ...actions,
        ...store,
    }
}

// Internal Provider Component used by Form
export const FormProvider = ({ children, initialValues = {} }: { children: React.ReactNode, initialValues?: dynamic }) => {

    const store = useRef<FormStore>({ 
        values: initialValues, 
        errors: {}, 
        touched: {} 
    });
    const prevInitialKeys = useRef<Set<string>>(new Set(Object.keys(initialValues)));
    const subscribers = useRef(new Set<() => void>());
    const getSnapshot = useCallback(() => store.current, []);
    const subscribe = useCallback((cb: () => void) => {
        subscribers.current.add(cb);
        return () => subscribers.current.delete(cb);
    }, []);

    const notify = () => {
        // console.log("Notifying", subscribers.current.size, "subscribers");
        subscribers.current.forEach(cb => cb())
    };

    useEffect(() => {
        // console.log(initialValues)
        if (initialValues && Object.keys(initialValues).length > 0) {
            const newKeys = new Set(Object.keys(initialValues));
            const removedKeys = [...prevInitialKeys.current].filter(k => !newKeys.has(k));
            
            const currentValues = { ...store.current.values };
            removedKeys.forEach(k => delete currentValues[k]);
            
            store.current = { 
                ...store.current, 
                values: {
                    ...currentValues,
                    ...initialValues 
                }
            };
            prevInitialKeys.current = newKeys;
            notify();
        }
    }, [initialValues]);

    const actions = useMemo(() => ({
        subscribe,
        getSnapshot,
        setFieldValue: (name: string, value: any) => {
            if (store.current.values[name] === value) return;
            store.current = {
                ...store.current,
                values: {
                    ...store.current.values,
                    [name]: value
                }
            }
            notify();
        },
        deleteFieldValue: (name: string) => {
            if (!(name in store.current.values)) return;
            const { [name]: _, ...rest } = store.current.values;
            store.current = { ...store.current, values: rest };
            notify();
        },
        setFieldError: (name: string, error: string | null) => {
            store.current = { 
                ...store.current,
                errors: {
                    ...store.current.errors, 
                    [name]: error 
                }
            };
            notify();
        },
        reset: () => {
             store.current = { values: {}, errors: {}, touched: {} };
             notify();
        }
    }), []);

    return <FormContext.Provider value={actions}>{children}</FormContext.Provider>;
};