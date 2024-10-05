import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from "react";
import With from "./base";
import { DRAWER_SIDE, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
const Drawer = forwardRef((props, ref) => {
    const { as, from, speed, children, ...rest } = props;
    const [visible, setVisible] = useState(false);
    const divRef = useRef(null);
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
        open() {
            setVisible(true);
        },
        close() {
            setVisible(false);
        }
    }));
    return _jsxs(_Fragment, { children: [_jsx(With, { className: `zuz-overlay fixed fill`, onClick: (e) => {
                    if (visible) {
                        setVisible(false);
                    }
                }, "aria-hidden": !visible, animate: {
                    transition: TRANSITIONS.FadeIn,
                    when: visible,
                } }), _jsxs(With, { ref: divRef, as: as, className: `zuz-drawer flex cols drawer-${from ? from.toLowerCase() : `left`} fixed`, animate: {
                    from: { ...style.from, opacity: 0 },
                    to: { ...style.to, opacity: 1 },
                    when: visible,
                    curve: TRANSITION_CURVES.EaseInOut,
                    duration: speed || .5,
                }, ...rest, children: [from == DRAWER_SIDE.Top || from == DRAWER_SIDE.Bottom ? _jsx(With, { className: "drawer-handle" }) : null, children] })] });
});
export default Drawer;
