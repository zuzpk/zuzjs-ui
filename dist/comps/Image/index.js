"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
const Image = forwardRef((props, ref) => {
    const { style, className, rest } = useBase(props);
    return _jsx("img", { ref: ref, style: style, className: `${className} flex`, ...rest });
});
export default Image;
