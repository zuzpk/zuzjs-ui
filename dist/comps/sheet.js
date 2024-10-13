"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import With from "./base";
import { SHEET, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
import Cover from "./cover";
import { animationTransition } from "../funs/css";
import useComponentEditor from "../hooks/useCompEditor";
import ComponentEditor from "./editor";
let _sheetTimeout = null;
let _sheetWobbleTimeout = null;
const Sheet = forwardRef((props, ref) => {
    const { as, transition, curve, speed, editor, type, ...rest } = props;
    const _editor = useComponentEditor();
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState(``);
    const [msg, setMsg] = useState(``);
    const [action, setAction] = useState(null);
    const [_errorType, setErrorType] = useState(type || SHEET.Default);
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
    const buildAnimation = () => {
        const base = {
            when: visible,
            duration: speed || 0.3,
            delay: 0.1,
        };
        if (_errorType == SHEET.Dialog) {
            if (transition) {
                const { from, to } = animationTransition(transition);
                return {
                    from: { ...from, x: `-50%`, y: `-50%` },
                    to: { ...to, x: `-50%`, y: `-50%` },
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
    };
    const sheetProps = useMemo(() => ({
        "sheet-radius": `label:Radius type:range value:auto min:0 max:50 unit:px`,
    }), []);
    const toastProps = useMemo(() => ({
        "sheet-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
        "sheet-font-size": `label:Font,Size type:range value:auto min:12 max:72 unit:px`,
    }), []);
    const dialogProps = useMemo(() => ({
        "sheet-bg": `label:Background type:color value:auto`,
        "@group-Head": {
            label: "Head",
            pops: {
                "sheet-title-opacity": `label:Opacity type:range value:auto min:0 max:1 step:0.1`,
                "sheet-head-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
            }
        },
        "@group-Body": {
            label: "Body",
            pops: {
                "sheet-body-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
            }
        },
        "@group-Footer": {
            label: "Footer",
            pops: {
                "sheet-footer": `label:Background type:color value:auto`,
                "sheet-footer-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
                "@group-Action": {
                    label: "Footer Action",
                    pops: {
                        "sheet-action": `label:Background type:color value:auto`,
                        "sheet-action-color": `label:Text,Color type:color value:auto`,
                        "sheet-action-hover": `label:Hover,Color type:color value:auto`,
                        "sheet-action-radius": `label:Radius type:range value:auto min:0 max:50 unit:px`,
                    }
                }
            }
        },
        "@group-Close": {
            label: "Close Button",
            pops: {
                "sheet-closer-font-size": `label:Size type:range value:auto min:8 max:72 step:2 unit:px`,
                "sheet-closer-color": `label:Color type:color value:auto`,
                "sheet-closer-opacity": `label:Opacity type:range value:auto min:0 max:1 step:0.1`,
                "sheet-closer-hover-opacity": `label:Hover,Opacity type:range value:auto min:0 max:1 step:0.1`,
            }
        }
    }), []);
    useEffect(() => {
    }, []);
    if (_errorType == SHEET.Dialog) {
        return _jsxs(_Fragment, { children: [_jsx(With, { "aria-hidden": !visible, className: `zuz-overlay fixed fill`, animate: {
                        transition: TRANSITIONS.FadeIn,
                        when: visible,
                        duration: 0.1,
                    } }), _jsxs(With, { animate: buildAnimation(), as: as, className: `zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim(), ...rest, ref: divRef, children: [_jsx(Cover, { ...({ when: loading }) }), _jsxs(With, { className: `sheet-head flex aic rel`, children: [_jsx(With, { className: `sheet-${title ? `title` : `dot`}`, children: title || `` }), _jsx(With, { tag: `button`, onClick: (e) => setVisible(false), className: `sheet-closer abs`, children: "\u00D7" })] }), _jsx(With, { className: `sheet-body flex aic rel`, children: msg }), action && _jsx(With, { className: `sheet-footer flex aic rel`, children: action.map((a, i) => _jsx(With, { onClick: a.handler, tag: `button`, as: `sheet-action-btn`, children: a.label })) })] }), props.editor && visible && _jsx(ComponentEditor, { element: `.zuz-sheet`, title: `Sheet`, attrs: {
                        ...sheetProps,
                        ...(_errorType == SHEET.Dialog ? dialogProps : toastProps)
                    } })] });
    }
    return _jsx(With, { animate: buildAnimation(), as: as, className: `zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim(), ...rest, ref: divRef, children: visible ? msg : null });
});
export default Sheet;
