"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useShortcuts } from "../../hooks";
import { DRAWER_SIDE, KeyCode, TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import Overlay from "../Overlay";
const Drawer = forwardRef((props, ref) => {
    const { as, from, speed, children, prerender, onClose, ...pops } = props;
    const [render, setRender] = useState(undefined == prerender ? true : prerender);
    const [visible, setVisible] = useState(false);
    const divRef = useRef(null);
    const [content, setContent] = useState(children);
    useShortcuts([
        { keys: [KeyCode.Escape], callback: () => {
                if (visible) {
                    onClose?.();
                    setVisible(false);
                }
            } }
    ]);
    useEffect(() => {
        setContent(children);
    }, [children]);
    const style = useMemo(() => {
        switch (from) {
            case DRAWER_SIDE.Left:
                return { from: { x: `-100vh` }, to: { x: 0 } };
            case DRAWER_SIDE.Right:
                return { from: { x: `100vh` }, to: { x: 0 } };
            case DRAWER_SIDE.Top:
                return { from: { y: `-100vh` }, to: { y: 0 } };
            case DRAWER_SIDE.Bottom:
                return { from: { y: `100vh` }, to: { y: 0 } };
            default:
                return { from: { x: `-100vh` }, to: { x: 0 } };
        }
    }, []);
    useImperativeHandle(ref, () => ({
        open(child) {
            if (child)
                setContent(child);
            setVisible(true);
        },
        close() {
            onClose?.();
            setVisible(false);
        }
    }));
    return _jsxs(_Fragment, { children: [_jsx(Overlay, { onClick: (e) => {
                    if (visible) {
                        onClose?.();
                        setVisible(false);
                    }
                }, when: visible }), _jsxs(Box, { ref: divRef, className: `--drawer flex cols --${from ? from.toLowerCase() : `left`} fixed`, fx: {
                    from: { ...style.from, opacity: 0 },
                    to: { ...style.to, opacity: 1 },
                    when: visible,
                    curve: TRANSITION_CURVES.EaseInOut,
                    duration: speed || .5,
                }, ...pops, children: [from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? _jsx(Box, { className: `--handle` }) : null, render ? content : visible ? content : null] })] });
});
Drawer.displayName = `Drawer`;
export default Drawer;
