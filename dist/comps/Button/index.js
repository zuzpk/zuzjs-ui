"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useState } from 'react';
import { useBase } from '../../hooks';
import Icon from '../Icon';
import Span from '../Span';
import { ButtonState } from './types';
import Spinner from '../Spinner';
import { Size } from '../../types/enums';
const Button = forwardRef((props, ref) => {
    const { icon, iconSize, children, withLabel, spinner, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const [loading, setLoading] = useState(false);
    useImperativeHandle(ref, () => ({
        setState: (mod) => {
            if (mod == ButtonState.Loading) {
                setLoading(true);
            }
            else if (mod == ButtonState.Normal) {
                setLoading(false);
            }
        },
        reset: () => {
            setLoading(false);
        }
    }));
    return _jsxs("button", { className: `${className} flex aic jcc ${icon ? `ico-btn` : ``}`, style: style, ref: ref, ...rest, children: [loading && _jsx(Spinner, { size: Size.Small, color: `#ffffff`,
                ...(spinner || {}) }), !loading && icon && _jsx(Icon, { size: iconSize, name: icon }), withLabel === true ? _jsx(Span, { children: children }) : children] });
});
export default Button;
