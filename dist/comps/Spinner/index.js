"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import Box from "../Box";
import { SPINNER } from "../../types/enums";
import { useBase } from "../../hooks";
import { hexToRgba } from "../../funs";
const Spinner = forwardRef((props, ref) => {
    const { type, size, width, speed, color, background, foreground, ...pops } = props;
    const defaultColor = `#000000`;
    const { className, style, rest } = useBase(pops);
    const build = () => {
        const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor);
        const bg = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor, .3);
        const _props = {
            width: size || 30,
            height: size || 30,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        };
        return _props;
    };
    return _jsx(Box, { className: `${className} --spinner --${(type || SPINNER.Simple).toLowerCase()}`.trim(), style: {
            ...style,
            ...build()
        }, ...rest });
});
export default Spinner;
