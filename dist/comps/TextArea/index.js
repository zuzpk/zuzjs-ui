"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
const TextArea = forwardRef((props, ref) => {
    const { autoResize, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const handleInput = (event) => {
    };
    return _jsx("textarea", { className: `--input --textarea flex ${className}`.trim(), style: style, onInput: handleInput, ref: ref, ...rest });
});
export default TextArea;
