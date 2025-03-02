"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import Box from "../Box";
import { Size, SPINNER } from "../../types/enums";
import { useBase } from "../../hooks";
import { hexToRgba } from "../../funs";
const Spinner = forwardRef((props, ref) => {
    const { type, size, width, speed, color, background, foreground, ...pops } = props;
    const defaultColor = `#000000`;
    const { className, style, rest } = useBase(pops);
    const build = () => {
        const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor);
        const bg = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor, .3);
        const sizes = {
            [Size.Small]: 20,
            [Size.Medium]: 30,
            [Size.Large]: 50,
            default: 20
        };
        const _size = size ? Object.values(Size).includes(size) ? sizes[size] : size : sizes.default;
        const _animationSetting = {
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        };
        const _props = (type || SPINNER.Simple) == SPINNER.Simple ? {
            width: _size,
            height: _size,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            ..._animationSetting
        } : {
        // ..._animationSetting
        };
        return _props;
    };
    const child = () => {
        switch (type || SPINNER.Simple) {
            case SPINNER.Simple:
                return null;
                break;
            case SPINNER.Wave:
                return _jsxs(_Fragment, { children: [_jsx(Box, { as: `--dot --dot-1` }), _jsx(Box, { as: `--dot --dot-2` }), _jsx(Box, { as: `--dot --dot-3` })] });
                break;
            case SPINNER.Roller:
                return null;
                break;
        }
    };
    return _jsx(Box, { className: `${className} --spinner --${(type || SPINNER.Simple).toLowerCase()} --${size || Size.Default}`.trim(), style: {
            ...style,
            ...build()
        }, ...rest, children: child() });
});
export default Spinner;
