"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
const Input = forwardRef((props, ref) => {
    const { size, variant, numeric, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const handleInput = (event) => {
        if (numeric) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
        }
    };
    return _jsx("input", { className: `--input ${size || variant ? `--${size || variant}` : ``} flex ${className}`.trim(), style: style, onInput: handleInput, ref: ref, ...rest });
});
Input.displayName = `Input`;
export default Input;
