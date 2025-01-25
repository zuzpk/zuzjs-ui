"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import Icon from '../Icon';
import Span from '../Span';
import { ButtonState } from './types';
import Spinner from '../Spinner';
import { Size } from '../../types/enums';
const Button = forwardRef((props, ref) => {
    const { reset, size, icon, iconSize, children, withLabel, spinner, state, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    return _jsxs("button", { 
        // className={`${reset ? `flex` : `--button ${size ? `--${size}` : ``} flex aic jcc`.trim()} ${icon ? `ico-btn` : ``} ${className}`.trim()}
        className: `${size ? `--button --${size}` : ``} flex aic jcc ${icon ? `ico-btn` : ``} ${className}`.trim(), style: style, ref: ref, ...rest, children: [state == ButtonState.Loading && _jsx(Spinner, { size: Size.Small, color: `#ffffff`,
                ...(spinner || {}) }), (!state || state == ButtonState.Normal) && _jsxs(_Fragment, { children: [icon && _jsx(Icon, { size: iconSize, name: icon }), withLabel === true ? _jsx(Span, { children: children }) : children] })] });
});
export default Button;
