"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, startTransition, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import Box from "../Box";
import { useBase } from "../../hooks";
import Sheet from "../Sheet";
import Cover from "../Cover";
import { FORMVALIDATION, SHEET } from "../../types/enums";
import { addPropsToChildren, isEmail, withPost } from "../../funs";
/**
 * {@link Form} is a controlled component designed to handle form data submission, validation, and display of loading or error states.
 * It allows for optional server-side submission through an action endpoint and customizable success/error handling callbacks.
 *
 * The component also provides an interface for controlling loading and error states from a parent component using {@link FormHandler}.
 *
 * @param props - Properties to configure form behavior, validation messages, submission handling, and visual feedback.
 * @param ref - Reference to the {@link FormHandler} interface, exposing methods to control loading and error states from the parent.
 */
const Form = forwardRef((props, ref) => {
    const { name, cover, spinner, errors, action, children, withData, beforeSubmit, onSubmit, onError, onSuccess, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const [loading, setLoading] = useState(false);
    const innerRef = useRef(null);
    const sheet = useRef(null);
    const submit = useRef(null);
    /**
     * Utility function to select multiple DOM elements within the form based on a CSS query.
     * @param query - CSS selector to match elements inside the form.
     */
    const _nodes = useCallback((query) => {
        if (innerRef.current)
            return innerRef.current.querySelectorAll(query);
        return [];
    }, [innerRef.current]);
    const _getFields = (el) => {
        return {
            name: el.name || el.getAttribute(`name`) || el.getAttribute(`data-name`),
            required: el.required ? true
                : el.getAttribute(`data-required`) ? el.getAttribute(`data-required`) == `true` : false,
            with: el.with || el.getAttribute(`with`)
        };
    };
    const _getPinValue = (el) => {
        const _pin = [];
        el.querySelectorAll(`.--input`).forEach((input) => {
            _pin.push(input.value);
        });
        return _pin.join('');
    };
    /**
     * Validates form fields based on their type and custom attributes.
     *
     * @param el - The element to validate.
     * @returns Whether the element meets the required validation criteria.
     */
    const _validate = useCallback((el) => {
        const { name: _name, required: _required, with: _with } = _getFields(el);
        if (_required) {
            /**
             * @internal
             * Required field validation */
            if (el.type == `checkbox` && el.checked == false) {
                return false;
            }
            if (el.classList.contains(`--otp`)) {
                const _pin = _getPinValue(el);
                if (_pin == `` || _pin.length < parseInt(el.getAttribute(`data-size`))) {
                    return false;
                }
            }
            if (el.classList.contains(`--select`) && el.querySelector(`button.--selected`).dataset.value == `-1`) {
                return false;
            }
            if (el.value == ``)
                return false;
        }
        /**
         * @internal
         * Additional validation based on `with` attribute
         */
        if (el.getAttribute(`with`)) {
            let _with = el.getAttribute(`with`);
            if (_with.includes(`@`)) {
                _with = _with.split(`@`)[0];
                if (_with == `match`) {
                    _with = FORMVALIDATION.MatchField;
                }
            }
            switch (_with.toUpperCase()) {
                case FORMVALIDATION.Email:
                    return isEmail(el.value);
                    break;
                case FORMVALIDATION.Uri:
                    console.log(`Add FORMVALIDATION.Uri`);
                    return false;
                    break;
                case FORMVALIDATION.Password:
                    console.log(`Add FORMVALIDATION.Password`);
                    return false;
                    break;
                case FORMVALIDATION.MatchField:
                    const [__, field] = el.getAttribute(`with`).split(`@`);
                    const _el = document.querySelector(`[name=${field.trim()}]`);
                    if (!_el)
                        return false;
                    // console.log(`matching`, _el.name, _el.value, el.name, el.value)                    
                    if (_el && _el.value != el.value) {
                        return false;
                    }
                    break;
                default:
                    return true;
            }
        }
        return true;
    }, [innerRef.current]);
    /**
     * Constructs the form data and validates the fields.
     *
     * @returns Form data object along with validation status and error information.
     */
    const _buildFormData = useCallback(() => {
        const data = {};
        const payload = {};
        let _error = null;
        let _errorMsg = null;
        Array.from(_nodes(`[name]`))
            .forEach((el) => {
            const { name: _name, required: _required, with: _with } = _getFields(el);
            let valid = true;
            if (_required || _with)
                valid = _validate(el);
            data[_name] = {
                valid: valid,
                value: el.type == `checkbox` ? el.checked == true ? el.value : false
                    : el.classList.contains(`--otp`) ? _getPinValue(el)
                        : el.classList.contains(`--select`) ? el.querySelector(`button.--selected`).dataset.value : el.value
            };
            payload[_name] = el.type == `checkbox` ? el.checked == true ? true : false
                : el.classList.contains(`--otp`) ? _getPinValue(el)
                    : el.classList.contains(`--select`) ? el.querySelector(`button.--selected`).dataset.value : el.value;
            if (!valid) {
                if (_error == null && errors) {
                    _error = el;
                    _errorMsg = errors[_name];
                }
                el.classList.add(`input-with-error`);
            }
            else
                el.classList.remove(`input-with-error`);
        });
        if (_error) {
            const _nxt = _error;
            if (_nxt.classList.contains(`--otp`)) {
                for (const i of Array.from(_nxt.querySelectorAll(`.--input`))) {
                    const input = i;
                    if (input.value == ``) {
                        input.focus();
                        break;
                    }
                }
            }
            else
                _nxt.focus();
        }
        return {
            error: _error != null,
            errorMsg: _errorMsg || `Fix errors to continue...`,
            data, payload
        };
    }, [innerRef.current]);
    /**
     * Handler for form submission that validates and processes the form data.
     */
    const _onSubmit = useCallback(() => {
        const { error, errorMsg, payload } = _buildFormData();
        if (error) {
            sheet.current.error(errorMsg);
        }
        else if (action) {
            // If `action` is defined, submit the form data to the specified endpoint
            startTransition(async () => {
                beforeSubmit && beforeSubmit(payload);
                setLoading(true);
                sheet.current.hide();
                // submit.current?.setState(ButtonState.Loading)
                withPost(action, { ...payload, ...(withData || {}) })
                    .then(_resp => {
                    const resp = _resp;
                    setLoading(false);
                    // submit.current?.reset()
                    if (onSuccess)
                        onSuccess(resp);
                    else {
                        sheet.current.hide();
                        sheet.current.success(resp.message || `Redirecting..`);
                    }
                })
                    .catch(err => {
                    console.warn(`Error occurred while submitting form`, err);
                    setLoading(false);
                    // submit.current?.reset()
                    if (onError)
                        onError(err);
                    else
                        sheet.current.show(err.message || `We cannot process your request at this time.`, 4, SHEET.Error);
                });
            });
        }
        else {
            onSubmit && onSubmit(payload);
        }
    }, [action, sheet.current, innerRef.current]);
    /**
     * Initializes the form by adding click event listeners to submit buttons.
     */
    const _init = useCallback(() => {
        const _submit = _nodes(`[type=submit]`);
        if (!_submit || _submit.length == 0) {
            console.warn(`You should add at least 1 button with type=\`SUBMIT\``);
        }
        else {
            _submit.forEach(el => {
                el.addEventListener(`click`, _onSubmit);
            });
        }
    }, [innerRef.current]);
    const buildChildren = useMemo(() => addPropsToChildren(children, child => child.props.type == `submit`, { ref: submit }), [children]);
    useImperativeHandle(ref, () => ({
        setLoading(mod) {
            if (mod) {
                sheet.current.hide();
            }
            setLoading(mod);
        },
        showError(errorMsg) {
            sheet.current.error(errorMsg, 4);
        },
        hideError() {
            sheet.current.hide();
        },
        init() {
            _init();
        }
    }));
    useEffect(_init, []);
    return _jsxs(Box, { ref: innerRef, style: style, className: `--form flex rel ${className} ${name ? `--form-${name.replace(/\s+/g, `-`)}` : ``}`, propsToRemove: [`withData`, `action`, `onSubmit`, `onSuccess`, `onError`], children: [_jsx(Sheet, { ref: sheet, as: `--sheet-form` }), _jsx(Cover, { message: cover ? cover.message || undefined : `working`, spinner: spinner, color: cover ? `color` in cover ? cover.color : `#ffffff` : `#ffffff`, when: loading }), buildChildren] });
});
export default Form;
