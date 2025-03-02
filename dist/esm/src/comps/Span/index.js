"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
const Span = forwardRef((props, ref) => {
    const { style, ...pops } = props;
    const { style: _style, className, rest } = useBase(pops);
    return _jsx("span", { ref: ref, style: style, className: className, ...rest });
});
export default Span;
