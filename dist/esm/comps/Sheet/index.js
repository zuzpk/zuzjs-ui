"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { uuid } from "../../funs";
import { animationTransition } from "../../funs/css";
import { useBase } from "../../hooks";
import { SHEET, SHEET_ACTION_POSITION, TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import Button from "../Button";
import Cover from "../Cover";
import Overlay from "../Overlay";
let _sheetTimeout = null;
let _sheetWobbleTimeout = null;
const Sheet = forwardRef((props, ref) => {
    const { title: _title, message, transition, curve, speed, type, actionPosition, spinner, loadingMessage, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const [title, setTitle] = useState(_title || ``);
    const [msg, setMsg] = useState(message || ``);
    const [action, setAction] = useState(null);
    const [sheetType, setSheetType] = useState(type || SHEET.Default);
    const sheetID = useMemo(() => uuid(), []);
    const [visible, setVisible] = useState(false);
    const innerRef = useRef(null);
    const lastTransform = useRef(null);
    const [loading, setLoading] = useState(false);
    const [render, setRender] = useState(true);
    const _render = useRef(null);
    const renderMessage = msg; //useMemo(() => msg, [msg])
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
                innerRef.current.classList.remove(`--wobble`);
                setTimeout(() => innerRef.current.classList.add(`--wobble`), 50);
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current.classList.remove(`--wobble`);
                    _sheetWobbleTimeout = null;
                }, 500);
            }
            setSheetType(SHEET.Dialog);
            if (message)
                setMsg(message);
            if (title)
                setTitle(title);
            if (action)
                setAction(action.reduce((ar, b) => {
                    ar.push({
                        ...b,
                        key: b.key || uuid()
                    });
                    return ar;
                }, []));
            setVisible(true);
            setTimeout(() => onShow ? onShow() : () => { }, 1000);
        },
        dialog(title, message, action, 
        // actionRef?: React.RefObject<HTMLElement>,
        onShow) {
            if (_sheetTimeout) {
                clearTimeout(_sheetTimeout);
                if (_sheetWobbleTimeout) {
                    clearTimeout(_sheetWobbleTimeout);
                }
                innerRef.current.classList.remove(`--wobble`);
                setTimeout(() => innerRef.current.classList.add(`--wobble`), 50);
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current.classList.remove(`--wobble`);
                    _sheetWobbleTimeout = null;
                }, 500);
            }
            setSheetType(SHEET.Dialog);
            setMsg(message);
            setTitle(title);
            if (action)
                setAction(action.reduce((ar, b) => {
                    ar.push({
                        ...b,
                        key: b.key || uuid()
                    });
                    return ar;
                }, []));
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
                // if ( lastTransform ) innerRef.current!.style.transform = _lastTransform
                lastTransform.current = innerRef.current.style.transform;
                innerRef.current.style.transform = ``;
                innerRef.current.classList.remove(`--wobble`);
                setTimeout(() => {
                    innerRef.current.classList.add(`--wobble`);
                    innerRef.current.style.transform = `${lastTransform.current} scale(.9)`.trim();
                }, 50);
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current.classList.remove(`--wobble`);
                    innerRef.current.style.transform = lastTransform.current || ``;
                    _sheetWobbleTimeout = null;
                }, 500);
            }
            _sheetTimeout = setTimeout(() => {
                setVisible(false);
                _sheetTimeout = null;
                _sheetWobbleTimeout = null;
            }, (duration || 4) * 1000);
            setSheetType(type || SHEET.Default);
            setMsg(message);
            setVisible(true);
        },
        hide() {
            setVisible(false);
        }
    }));
    const buildAnimation = useMemo(() => {
        const base = {
            when: visible,
            duration: speed || 0.3,
            delay: 0.1,
        };
        if (sheetType == SHEET.Dialog) {
            if (transition) {
                const { from, to } = animationTransition(transition, 20, true);
                return {
                    // from: { ...from, x: `-50%`, y: `-50%` },
                    // to: { ...to, x: `-50%`, y: `-50%` },
                    // from: { ...from, x: `-50%` },
                    // to: { ...to, x: `-50%` },
                    from, to,
                    curve: curve || TRANSITION_CURVES.EaseInOut,
                    ...base
                };
            }
            return {
                from: { scale: 0, x: `-50%`, y: `-50%`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: `-50%`, opacity: 1 },
                curve: TRANSITION_CURVES.Spring,
                ...base
            };
        }
        else {
            return {
                from: { scale: 0, x: `-50%`, y: `-10vh`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: 0, opacity: 1 },
                curve: TRANSITION_CURVES.Spring,
                ...base
            };
        }
    }, [visible, sheetType]);
    useEffect(() => {
        if (_render.current)
            clearTimeout(_render.current);
        if (!visible) {
            _render.current = setTimeout(() => setRender(false), 1000);
        }
        else {
            setRender(true);
        }
    }, [visible]);
    if (sheetType == SHEET.Dialog) {
        return _jsxs(_Fragment, { children: [_jsx(Overlay, { when: visible }), _jsxs(Box, { className: `--sheet --sheet-${sheetType.toLowerCase()} ${className} fixed`.trim(), style: style, fx: buildAnimation, ...rest, ref: innerRef, children: [_jsx(Cover, { when: loading, spinner: spinner, message: loadingMessage }), _jsxs(Box, { className: `--head flex aic rel`, children: [_jsx(Box, { className: `--${title ? `title` : `dot`} flex aic rel`, children: title || `` }), _jsx(Button, { onClick: (e) => setVisible(false), className: `--closer abs`, children: "\u00D7" })] }), _jsx(Box, { className: `--body flex aic rel ${action ? `` : `--no-action`}`.trim(), children: render ? renderMessage : null }), action && _jsx(Box, { className: `--footer flex aic rel ${actionPosition ? actionPosition == SHEET_ACTION_POSITION.Center ? `jcc` : `` : `jce`}`.trim(), children: action.map((a, i) => _jsx(Button, { onClick: (e) => a.handler ? a.handler() : a.onClick ? a.onClick() : console.log(`onClick Handler missing`), className: `--action`, children: a.label }, `sheet-${sheetID}-action-${a.key}`)) })] })] });
    }
    return _jsx(Box, { className: `--sheet --sheet-${sheetType.toLowerCase()} ${className} abs`.trim(), style: style, ...rest, animate: buildAnimation, ref: innerRef, children: visible ? msg : null });
});
export const isSheetHandler = (src) => {
    return typeof src === `object`
        && null != src
        && `setLoading` in src
        && `success` in src
        && `error` in src;
};
Sheet.displayName = `Sheet`;
export default Sheet;
