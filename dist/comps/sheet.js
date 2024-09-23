"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import With from "./base";
import { SHEET } from "../types/enums";
let _sheetTimeout = null;
let _sheetWobbleTimeout = null;
const Sheet = forwardRef((props, ref) => {
    const { as, ...rest } = props;
    const [visible, setVisible] = useState(false);
    const [msg, setMsg] = useState(``);
    const [_errorType, setErrorType] = useState(SHEET.Default);
    const divRef = useRef(null);
    useImperativeHandle(ref, () => ({
        showDialog(message, onShow) {
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
            setVisible(true);
            setTimeout(() => onShow ? onShow() : () => { }, 1000);
        },
        show(message, duration, type) {
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
                } }), _jsx(With, { animate: _errorType == SHEET.Dialog ? {
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
                }, as: as, className: `zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim(), ...rest, ref: divRef, children: visible && msg == `` ? `Lorem ipsum dolor sit amet, consectetur adipiscing...` : msg })] });
});
export default Sheet;
