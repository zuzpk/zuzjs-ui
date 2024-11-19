"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import Icon from '../Icon';
import Span from '../Span';
const Button = forwardRef((props, ref) => {
    const { icon, children, withLabel, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    return _jsxs("button", { className: `${className} flex aic jcc ${icon ? `ico-btn` : ``}`, style: style, ref: ref, ...rest, children: [icon && _jsx(Icon, { name: icon }), withLabel === true ? _jsx(Span, { children: children }) : children] });
});
export default Button;
