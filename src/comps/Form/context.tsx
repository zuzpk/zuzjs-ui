"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
import { dynamic } from "../../types";

interface FormStore {
    values: dynamic;
    errors: dynamic;
    touched: Record<string, boolean>;
    isDirty: boolean;
}

interface FormContextValue {
    subscribe: (cb: () => void) => () => void;
    getSnapshot: () => FormStore;
    setFieldValue: (name: string, value: any) => void;
    deleteFieldValue: (name: string) => void;
    setFieldError: (name: string, error: string | null) => void;
    setFieldErrors: (updates: Record<string, string | null>) => void;
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

const _noopSubscribe = () => () => {}

export const useFormIsDirty = () => {
    const context = useContext(FormContext);
    return useSyncExternalStore(
        context?.subscribe ?? _noopSubscribe,
        () => context?.getSnapshot().isDirty ?? false,
        () => false
    );
};

export const useFormFieldValue = (name?: string) => {
    const context = useContext(FormContext)
    return useSyncExternalStore(
        context?.subscribe ?? _noopSubscribe,
        () => {
            if (!context || !name) return undefined
            return context.getSnapshot().values?.[name]
        },
        () => undefined
    )
}

export const useFormFieldError = (name?: string) => {
    const context = useContext(FormContext)
    return useSyncExternalStore(
        context?.subscribe ?? _noopSubscribe,
        () => {
            if (!context || !name) return null
            return context.getSnapshot().errors?.[name] ?? null
        },
        () => null
    )
}

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

    const areValuesEqual = (a: dynamic = {}, b: dynamic = {}) => {
        const aKeys = Object.keys(a || {})
        const bKeys = Object.keys(b || {})
        if (aKeys.length !== bKeys.length) return false
        return aKeys.every((k) => Object.is(a?.[k], b?.[k]))
    }

    const getDirtyState = (values: dynamic, baseline: dynamic) => !areValuesEqual(values, baseline)

    const store = useRef<FormStore>({ 
        values: initialValues, 
        errors: {}, 
        touched: {},
        isDirty: false,
    });
    const baselineValues = useRef<dynamic>({ ...initialValues })
    const prevInitialKeys = useRef<Set<string>>(new Set(Object.keys(initialValues)));
    const initialValuesRef = useRef(initialValues);
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
        if (initialValues === initialValuesRef.current) return;
        initialValuesRef.current = initialValues;

        if (!initialValues || Object.keys(initialValues).length === 0) return

        const newKeys = new Set(Object.keys(initialValues));
        const removedKeys = [...prevInitialKeys.current].filter(k => !newKeys.has(k));

        const currentValues = { ...store.current.values };
        removedKeys.forEach(k => delete currentValues[k]);

        const nextValues = {
            ...currentValues,
            ...initialValues,
        }

        const prevValues = store.current.values || {}
        const nextEntries = Object.entries(nextValues)
        const prevEntries = Object.entries(prevValues)
        const hasChanged =
            nextEntries.length !== prevEntries.length ||
            nextEntries.some(([k, v]) => prevValues[k] !== v)

        prevInitialKeys.current = newKeys;
        if (!hasChanged) return

        baselineValues.current = { ...nextValues }
        store.current = {
            ...store.current,
            values: nextValues,
            isDirty: getDirtyState(nextValues, baselineValues.current),
        }
        notify();
    }, [initialValues]);

    const actions = useMemo(() => ({
        subscribe,
        getSnapshot,
        setFieldValue: (name: string, value: any) => {
            if (store.current.values[name] === value) return;
            const nextValues = {
                ...store.current.values,
                [name]: value
            }
            store.current = {
                ...store.current,
                values: nextValues,
                isDirty: getDirtyState(nextValues, baselineValues.current),
            }
            notify();
        },
        deleteFieldValue: (name: string) => {
            if (!(name in store.current.values)) return;
            const { [name]: _, ...rest } = store.current.values;
            store.current = { 
                ...store.current,
                values: rest,
                isDirty: getDirtyState(rest, baselineValues.current),
            };
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
        setFieldErrors: (updates: Record<string, string | null>) => {
            store.current = {
                ...store.current,
                errors: { ...store.current.errors, ...updates }
            };
            notify();
        },
        reset: () => {
             store.current = { 
                values: { ...baselineValues.current }, 
                errors: {}, 
                touched: {},
                isDirty: false,
            };
             notify();
        }
    }), []);

    return <FormContext.Provider value={actions}>{children}</FormContext.Provider>;
};