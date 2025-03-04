"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Variant } from '../../types/enums';
const TextArea = forwardRef((props, ref) => {
    const { autoResize, variant, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const handleInput = (event) => {
    };
    return _jsx("textarea", { className: `--input --textarea --${variant || Variant.Small} flex ${className}`.trim(), style: style, onInput: handleInput, ref: ref, ...rest });
});
TextArea.displayName = `TextArea`;
export default TextArea;
