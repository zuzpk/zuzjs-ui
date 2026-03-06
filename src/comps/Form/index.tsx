"use client"
import { _, withPost } from "@zuzjs/core";
import { addPropsToChildren } from "@zuzjs/core/react";
import { Ref, startTransition, useCallback, useImperativeHandle, useMemo, useRef, useState } from "react";
import useBase from "../../hooks/useBase";
import useToast from "../../hooks/useToast";
import { dynamic, FormInputs } from "../../types";
import { FORMVALIDATION } from "../../types/enums";
import Box from "../Box";
import Cover from "../Cover";
import { isSheetHandler } from "../Sheet";
import { FormProvider, useFormActions } from "./context";
import { FormHandler, FormProps } from "./types";

const unflatten = (data: any) => {
    const result: any = {};
    for (const key in data) {
        const keys = key.split(/[\[\]]+/).filter(Boolean);
        keys.reduce((acc, part, i) => {
            if (i === keys.length - 1) {
                acc[part] = data[key];
            } else {
                // If the next part is a number, create an array, otherwise an object
                const nextIsNumber = !isNaN(Number(keys[i + 1]));
                acc[part] = acc[part] || (nextIsNumber ? [] : {});
            }
            return acc[part];
        }, result);
    }
    return result;
};

const FormInternal = ({ ref, ...props }: FormProps & { ref?: Ref<FormHandler> }) => {
    const { 
        schema, name, cover, spinner, errors, action, children, 
        withData, beforeSubmit, onSubmit, onError, onSuccess, resetOnSuccess, ...pops 
    } = props;

    const { className, style, rest } = useBase(pops);
    const [loading, setLoading] = useState(false);
    const innerRef = useRef<HTMLDivElement>(null);
    const toast = useToast();
    const actions = useFormActions();

    const _nodes = useCallback((query: string) => 
        innerRef.current ? innerRef.current.querySelectorAll(query) : [], [innerRef.current]);

    const _getFields = (el: any) => {
        return {
            name: el.name || el.getAttribute(`name`) || el.getAttribute(`data-name`),
            required: el.required ? true 
                : el.getAttribute(`data-required`) ? el.getAttribute(`data-required`) == `true` : false,
            with: el.with || el.getAttribute(`with`)
        }
    }

    const _getPinValue = (el: any) => {
        const _pin : string[] = []
        el.querySelectorAll(`.--input`).forEach((input : HTMLInputElement) => {
            _pin.push(input.value)
        })
        return _pin.join('')
    }

    const _getValFromNode = (el: any) => {
        if ( el.classList.contains('--otp') ){
            return _getPinValue(el)
        }
        if ( el.classList.contains('--select') ){
            return el.querySelector('button.--selected')?.dataset.value 
        }
        if ( el.classList.contains('--checkbox') || el.getAttribute("type") === `checkbox` ){
            return el.checked
        }
        return el.value
    }

    // Validation logic (keeping your robust implementation)
    const _validate = useCallback((el: any): boolean => {

        const { 
            name : fieldName, 
            required, 
            with: withAttr 
        } = _getFields(el)

        // Resolve Value first
        const val = _getValFromNode(el)

        // Custom Schema Check (Priority)
        if (schema && schema[fieldName] && actions?.getSnapshot()) {
            const customResult = schema[fieldName](val, actions.getSnapshot().values);
            if (customResult === false || typeof customResult === "string") {
                // If string returned, update context error
                if (typeof customResult === "string") actions?.setFieldError(fieldName, customResult);
                return false;
            }
        }

        // Native / FORMVALIDATION checks
        // const required = el.required || el.getAttribute('data-required') === 'true';
        
        if (required) {
            if (el.type === 'checkbox' && !el.checked) return false;
            if (el.classList.contains('--select') && (val === '-1' || !val)) return false;
            if (!val || val === '') return false;
        }

        if (withAttr) {
            const normalizedWith = withAttr.includes('@') ? 
                withAttr.split('@')[0] == `match` ? FORMVALIDATION.MatchField
                    : withAttr.split('@')[0] 
                        : withAttr;
            switch (normalizedWith.toUpperCase()) {
                case FORMVALIDATION.IPV4: return _(val).isIPv4();
                case FORMVALIDATION.IPV6: return _(val).isIPv6();
                case FORMVALIDATION.Email: return _(val).isEmail();
                case FORMVALIDATION.Uri: try { new URL(val); return true; } catch { return false; }
                case FORMVALIDATION.MatchField:
                    const [ __, field, condition ] = withAttr.split(`@`)
                    const _el = document.querySelector<FormInputs>(`[name=${field.trim()}]`)
                    if ( !_el ) return false

                    switch( condition || `direct-match` ){
                        //Self should not empty
                        case "if-not-empty":
                            if (_el && !_(_el.value).isEmpty() && _el.value != el.value ){
                                return false;
                            }
                            break;
                        case "direct-match":
                            if( 
                                _el &&
                                _el.classList.contains(`--otp`) && 
                                el.classList.contains(`--otp`) &&
                                _getPinValue(_el) != _getPinValue(el)
                            ){
                                return false
                            }
                            else if ( _el && _el.value != el.value ){
                                return false
                            }
                            break;
                    }
                    break;
            }
        }

        return true;

    }, [schema, actions]);

    const _buildFormData = useCallback(() : {
        error: boolean,
        errorMsg: string,
        data: FormData | dynamic,
        payload: FormData | dynamic,
    } => {

        const data : dynamic = {}
        const flatPayload: dynamic = {};
        let firstErrorEl: HTMLElement | null = null;
        let _errorMsg: HTMLElement | string | null = null

        _nodes("[name]").forEach((el: any) => {

            const { 
                name : fieldName, 
                required, 
                with: withAttr 
            } = _getFields(el)

            // const fieldName = el.name || el.getAttribute('name');
            const isValid = required || withAttr ? _validate(el) : true;
            const value = _getValFromNode(el)

            data[fieldName] = { valid : isValid, value }
            flatPayload[fieldName] = value;
            actions?.setFieldError(fieldName, isValid ? null : (errors?.[fieldName] || "Invalid"));

            if (!isValid) {
                el.classList.add("--with-error");
                if (!firstErrorEl) firstErrorEl = el;
                _errorMsg = errors?.[fieldName];
            } else {
                el.classList.remove("--with-error");
            }

        });

        if ( firstErrorEl ){
            const _nxt = (firstErrorEl as HTMLElement)
            if ( _nxt.classList.contains(`--otp`) ){
                for( const i  of Array.from(_nxt.querySelectorAll(`.--input`))){
                    const input = i as HTMLInputElement
                    if ( input.value == `` ) {
                        input.focus()
                        break;
                    }
                }
            }
            else
                _nxt.focus()
        }

        const nestedPayload = unflatten(flatPayload);

        return {
            error: firstErrorEl != null,
            errorMsg: _errorMsg || `Fix errors to continue...`,
            data, 
            payload: nestedPayload
        }

    }, [innerRef.current])

    const _onSubmit = useCallback(() => {
        
        const { error, errorMsg, payload } = _buildFormData()

        if ( error ){
            toast.error(errorMsg)
            return
        }

        if (action) {
            startTransition(async () => {
                setLoading(true);
                withPost(action, { ...payload, ...withData })
                    .then((res) => {
                        setLoading(false);
                        if (resetOnSuccess) actions?.reset();
                        onSuccess?.(res);
                        if ( !onSuccess ) toast.success(res.message || `Redirecting...`)
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

FormInternal.displayName = `Zuz.FormInternal`

// Final Export wrapped in Provider
const Form = (props: FormProps & { ref?: Ref<FormHandler> }) => (
    <FormProvider initialValues={props.withData}>
        <FormInternal {...props} />
    </FormProvider>
);

Form.displayName = `Zuz.Form`

export default Form;