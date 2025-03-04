"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
const ProgressBar = forwardRef((props, ref) => {
    const { progress, type, ...pops } = props;
    const bar = useRef(null);
    useImperativeHandle(ref, () => ({
        setWidth: (p) => {
            bar.current.style.width = `${p * 100}%`;
        }
    }), []);
    useEffect(() => {
        if (progress && bar.current) {
            bar.current.style.width = `${progress * 100}%`;
        }
    }, []);
    const { className, style, rest } = useBase(pops);
    return _jsx(Box, { className: `--progress flex rel ${className}`.trim(), style: style, ...rest, children: _jsx(Box, { ref: bar, className: `--bar rel` }) });
});
ProgressBar.displayName = `ProgressBar`;
export default ProgressBar;
