"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import With from "./base";
import { SHEET } from "../types/enums";
import Cover from "./cover";
let _sheetTimeout = null;
let _sheetWobbleTimeout = null;
const Sheet = forwardRef((props, ref) => {
    const { as, ...rest } = props;
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState(``);
    const [msg, setMsg] = useState(``);
    const [action, setAction] = useState(null);
    const [_errorType, setErrorType] = useState(SHEET.Default);
    const [loading, setLoading] = useState(false);
    const divRef = useRef(null);
    const lastTransform = useRef(null);
    useImperativeHandle(ref, () => ({
        setLoading(mode) {
            setLoading(mode);
        },
        showDialog(title, message, action, onShow) {
            if (_sheetTimeout) {
                clearTimeout(_sheetTimeout);
                if (_sheetWobbleTimeout) {
                    clearTimeout(_sheetWobbleTimeout);
                }
                divRef.current.classList.remove(`wobble`);
                setTimeout(() => divRef.current.classList.add(`wobble`), 50);
                _sheetWobbleTimeout = setTimeout(() => {
                    divRef.current.classList.remove(`wobble`);
                    _sheetWobbleTimeout = null;
                }, 500);
            }
            setErrorType(SHEET.Dialog);
            setMsg(message);
            setTitle(title);
            if (action)
                setAction(action);
            setVisible(true);
            setTimeout(() => onShow ? onShow() : () => { }, 1000);
        },
        error(message, duration) {
            this.show(message, duration, SHEET.Error);
        },
        warn(message, duration) {
            this.show(message, duration, SHEET.Warn);
        },
        success(message, duration) {
            this.show(message, duration, SHEET.Success);
        },
        show(message, duration, type) {
            if (_sheetTimeout) {
                clearTimeout(_sheetTimeout);
                if (_sheetWobbleTimeout) {
                    clearTimeout(_sheetWobbleTimeout);
                }
                lastTransform.current = divRef.current.style.transform;
                divRef.current.style.transform = ``;
                divRef.current.classList.remove(`wobble`);
                setTimeout(() => {
                    divRef.current.classList.add(`wobble`);
                    divRef.current.style.transform = `${lastTransform.current} scale(.9)`.trim();
                }, 50);
                _sheetWobbleTimeout = setTimeout(() => {
                    divRef.current.classList.remove(`wobble`);
                    divRef.current.style.transform = lastTransform.current || ``;
                    _sheetWobbleTimeout = null;
                }, 500);
            }
            _sheetTimeout = setTimeout(() => {
                setVisible(false);
                _sheetTimeout = null;
                _sheetWobbleTimeout = null;
            }, (duration || 4) * 1000);
            setErrorType(type || SHEET.Default);
            setMsg(message);
            setVisible(true);
        },
        hide() {
            setVisible(false);
        }
    }));
    useEffect(() => {
    }, []);
    return _jsxs(_Fragment, { children: [_errorType == SHEET.Dialog && _jsx(With, { className: `zuz-sheet-overlay fixed fill`, animate: {
                    from: { y: `-100vh`, opacity: 0 },
                    to: { y: 0, opacity: 1 },
                    when: visible,
                    duration: 0.1,
                } }), _jsxs(With, { animate: _errorType == SHEET.Dialog ? {
                    from: { scale: 0, x: `-50%`, y: `-50%`, opacity: 0 },
                    to: { scale: 1, x: `-50%`, y: `-50%`, opacity: 1 },
                    when: visible,
                    duration: 0.3,
                    delay: 0.1,
                    curve: `spring`
                } : {
                    from: { scale: 0, x: `-50%`, y: `-10vh`, opacity: 0 },
                    to: { scale: 1, x: `-50%`, y: 0, opacity: 1 },
                    when: visible,
                    duration: 0.3,
                    delay: 0.1,
                    curve: `spring`
                }, as: as, className: `zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim(), ...rest, ref: divRef, children: [_errorType == SHEET.Dialog && _jsx(Cover, { ...({
                            when: loading,
                        }) }), _errorType == SHEET.Dialog && _jsxs(With, { className: `zuz-sheet-head flex aic rel`, children: [_jsx(With, { className: `zuz-sheet-${title ? `title` : `dot`}`, children: title || `` }), _jsx(With, { tag: `button`, onClick: (e) => setVisible(false), className: `zuz-sheet-closer abs`, children: "\u00D7" })] }), visible && msg == `` ? `Lorem ipsum dolor sit amet, consectetur adipiscing...` : msg] })] });
});
export default Sheet;
