"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import With from "./base";
import { isEmail, withPost } from "../funs";
import Sheet from "./sheet";
import { FORMVALIDATION, SHEET } from "../types/enums";
import Cover from "./cover";
const Form = forwardRef((props, ref) => {
    const { as, spinner, action, errors, cover, children, withData, onSuccess, onSubmit, onError, ...rest } = props;
    const [loading, setLoading] = useState(false);
    const [isLoading, startTransition] = useTransition();
    const [sheetType, setSheetType] = useState(SHEET.Default);
    const sheet = useRef(null);
    const _ref = useRef(null);
    const _nodes = (query) => _ref.current.querySelectorAll(query);
    const _validate = (el) => {
        if (el.required) {
            if (el.type == `checkbox` && el.checked == false) {
                return false;
            }
            if (el.value == ``)
                return false;
        }
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
                    console.log(`matching`, _el.name, _el.value, el.name, el.value);
                    if (_el && _el.value != el.value) {
                        return false;
                    }
                    break;
                default:
                    return true;
            }
        }
        return true;
    };
    const _buildFormData = () => {
        const data = {};
        const payload = {};
        let _error = null;
        let _errorMsg = null;
        Array.from(_nodes(`[name]`))
            .forEach((el) => {
            let valid = true;
            if (el.required || el.with)
                valid = _validate(el);
            data[el.name] = {
                valid: valid,
                value: el.value
            };
            payload[el.name] = el.value;
            if (!valid) {
                if (_error == null && errors) {
                    _error = el;
                    _errorMsg = errors[el.name];
                }
                el.classList.add(`input-with-error`);
            }
            else
                el.classList.remove(`input-with-error`);
        });
        if (_error)
            _error.focus();
        return {
            error: _error != null,
            errorMsg: _errorMsg || `Fix errors to continue...`,
            data, payload
        };
    };
    const _onSubmit = () => {
        const { error, errorMsg, payload } = _buildFormData();
        if (error) {
            sheet.current.show(errorMsg, 4, SHEET.Error);
        }
        else if (action) {
            startTransition(async () => {
                setLoading(true);
                sheet.current.hide();
                withPost(action, { ...payload, ...(withData || {}) })
                    .then(_resp => {
                    const resp = _resp;
                    setLoading(false);
                    if (onSuccess)
                        onSuccess(resp);
                    else
                        sheet.current.hide();
                    sheet.current.show(resp.message || `Redirecting..`, 4, SHEET.Success);
                })
                    .catch(err => {
                    setLoading(false);
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
    };
    const _init = () => {
        const _submit = _nodes(`[type=submit]`);
        if (!_submit || _submit.length == 0) {
            console.error(`You should add at least 1 button with type=\`SUBMIT\``);
        }
        else {
            _submit.forEach(el => {
                el.addEventListener(`click`, _onSubmit);
            });
        }
    };
    useImperativeHandle(ref, () => ({
        setLoading(mod) {
            setLoading(mod);
        },
        showError(errorMsg) {
            sheet.current.show(errorMsg, 4, SHEET.Error);
        }
    }));
    useEffect(_init, []);
    return _jsxs(With, { as: as, className: `rel`, ref: _ref, propsToRemove: [`withData`, `action`, `onSubmit`, `onSuccess`, `onError`], ...rest, children: [_jsx(Sheet, { ref: sheet }), loading && _jsx(Cover, { message: cover ? cover.message || undefined : `working`, ...{ spinner, color: cover ? `color` in cover ? cover.color : `#ffffff` : `#ffffff` } }), children] });
});
export default Form;
