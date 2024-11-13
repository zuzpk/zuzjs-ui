"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
const Box = forwardRef((props, ref) => {
    const { style, ...pops } = props;
    const { style: _style, className, rest } = useBase(pops);
    return _jsx("div", { ref: ref, className: className, style: {
            ..._style,
            ...(style || {})
        }, ...rest });
});
export default Box;
