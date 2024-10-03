import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
import { SPINNER } from "../types/enums";
import { hexToRgba } from "../funs";
const Spinner = forwardRef((props, ref) => {
    const { as, type, width, speed, size, color, background, foreground, ...rest } = props;
    const defaultColor = `#000000`;
    const buildSimple = () => {
        const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor);
        const bg = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor, .3);
        const pops = {
            width: size || 50,
            height: size || 50,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        };
        return pops;
    };
    const build = () => {
        let _ = {};
        switch (type || SPINNER.Simple) {
            case SPINNER.Simple:
                _ = buildSimple();
                break;
        }
        return _;
    };
    const getChild = () => {
        switch (type || SPINNER.Simple) {
            case SPINNER.Simple:
                break;
        }
        return null;
    };
    return _jsx(With, { as: as, ref: ref, tag: `div`, className: `zuz-spinner${type ? `-${type.toLowerCase()}` : ``}`, style: build(), ...rest, children: getChild() });
});
export default Spinner;
