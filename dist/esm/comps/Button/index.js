"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Size, SPINNER } from '../../types/enums';
import Icon from '../Icon';
import Span from '../Span';
import Spinner from '../Spinner';
import { ButtonState } from './types';
const Button = forwardRef((props, ref) => {
    const { reset, size, variant, icon, iconSize, children, withLabel, spinner, state, disabled, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    return _jsxs("button", { className: `--button ${variant ? `--${variant}` : ``} ${size ? `--${size}` : ``} flex aic ${!reset ? `jcc` : ``} ${icon ? `ico-btn` : ``} ${className}`.trim().replace(/\s+/g, ' '), style: style, ref: ref, disabled: state == ButtonState.Loading || props.skeleton?.enabled || disabled, ...rest, children: [state == ButtonState.Loading && _jsx(Spinner, { size: Size.Small, type: spinner || SPINNER.Simple }), (!state || state == ButtonState.Normal) && _jsxs(_Fragment, { children: [icon && _jsx(Icon, { size: iconSize, name: icon }), withLabel === true ? _jsx(Span, { children: children }) : children] })] });
});
Button.displayName = `Button`;
export default Button;
