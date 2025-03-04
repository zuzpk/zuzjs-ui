"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
const Label = forwardRef((props, ref) => {
    const { style, className, rest } = useBase(props);
    return _jsx("label", { ref: ref, style: style, className: className, ...rest });
});
Label.displayName = `Label`;
export default Label;
