"use client"
import { _, withPost } from "@zuzjs/core";
import { addPropsToChildren } from "@zuzjs/core/react";
import { Ref, startTransition, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import useBase from "../../hooks/useBase";
import useToast from "../../hooks/useToast";
import { dynamic } from "../../types";
import { FORMVALIDATION } from "../../types/enums";
import Box from "../Box";
import Cover from "../Cover";
import { isSheetHandler } from "../Sheet";
import { FormProvider, useFormActions } from "./context";
import { FormHandler, FormProps } from "./types";

const FormInternal = ({ ref, ...props }: FormProps & { ref?: Ref<FormHandler> }) => {
    const { 
        name, cover, spinner, errors, action, children, 
        withData, beforeSubmit, onSubmit, onError, onSuccess, resetOnSuccess, ...pops 
    } = props;

    const { className, style, rest } = useBase(pops);
    const [loading, setLoading] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const actions = useFormActions();

    const _nodes = useCallback((query: string) => 
        innerRef.current ? innerRef.current.querySelectorAll(query) : [], [innerRef.current]);

    // Validation logic (keeping your robust implementation)
    const _validate = useCallback((el: any): boolean => {
        const required = el.required || el.getAttribute('data-required') === 'true';
        const withAttr = el.getAttribute('with');
        const val = el.classList.contains('--otp') ? Array.from(el.querySelectorAll('.--input')).map((i: any) => i.value).join('')
                  : el.classList.contains('--select') ? el.querySelector('button.--selected')?.dataset.value 
                  : el.value;

        if (required) {
            if (el.type === 'checkbox' && !el.checked) return false;
            if (el.classList.contains('--select') && val === '-1') return false;
            if (!val || val === '') return false;
        }

        if (withAttr) {
            const normalizedWith = withAttr.includes('@') ? withAttr.split('@')[0] : withAttr;
            switch (normalizedWith.toUpperCase()) {
                case FORMVALIDATION.Email: return _(val).isEmail();
                case FORMVALIDATION.IPV4: return _(val).isIPv4();
                case FORMVALIDATION.Uri: try { new URL(val); return true; } catch { return false; }
                // Add other cases as per your enums...
            }
        }
        return true;
    }, []);

    const _onSubmit = useCallback(() => {
        const flatPayload: dynamic = {};
        let firstErrorEl: HTMLElement | null = null;

        _nodes("[name]").forEach((el: any) => {
            const fieldName = el.name || el.getAttribute('name');
            const isValid = _validate(el);
            const val = el.classList.contains('--select') ? el.querySelector('button.--selected')?.dataset.value : el.value;
            
            flatPayload[fieldName] = val;
            actions?.setFieldError(fieldName, isValid ? null : (errors?.[fieldName] || "Invalid"));

            if (!isValid) {
                el.classList.add("input-with-error");
                if (!firstErrorEl) firstErrorEl = el;
            } else {
                el.classList.remove("input-with-error");
            }
        });

        if (firstErrorEl) {
            (firstErrorEl as HTMLElement).focus();
            toast.error("Please fix the highlighted errors.");
            return;
        }

        const payload = flatPayload; // Use your unflatten utility here

        if (action) {
            startTransition(async () => {
                setLoading(true);
                withPost(action, { ...payload, ...withData })
                    .then(res => {
                        setLoading(false);
                        if (resetOnSuccess) actions?.reset();
                        onSuccess?.(res);
                    })
                    .catch(err => {
                        setLoading(false);
                        onError ? onError(err) : toast.error(err.message);
                    });
            });
        } else {
            onSubmit?.(payload);
        }
    }, [action, actions, errors]);

    // AUTO-PROP INJECTION Logic
    const buildChildren = useMemo(() => {
        return addPropsToChildren(
            children,
            (child) => child.props.name !== undefined || child.props.type === 'submit',
            (index, child) => {
                if (child.props.type === 'submit') {
                    return { onClick: _onSubmit };
                }
                // Inject real-time state listeners for components with 'name'
                return {
                    onChange: (val: any) => {
                        const name = child.props.name;
                        const actualVal = val?.target ? val.target.value : val;
                        actions?.setFieldValue(name, actualVal);
                        if (child.props.onChange) child.props.onChange(val);
                    }
                };
            }
        );
    }, [children, actions]);

    useImperativeHandle(ref, () => ({
        setLoading: (m) => setLoading(m),
        submit: () => _onSubmit(),
        init: () => {},
        hideError: () => toast.clearAll()
    }));

    return (
        <Box ref={innerRef} style={style} className={`--form flex rel ${className}`}>
            {!isSheetHandler(cover) && <Cover when={loading} spinner={spinner} {...cover} />}
            {buildChildren}
        </Box>
    );
};

// Final Export wrapped in Provider
const Form = (props: FormProps & { ref?: Ref<FormHandler> }) => (
    <FormProvider initialValues={props.withData}>
        <FormInternal {...props} />
    </FormProvider>
);

export default Form;