"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import Span from "../Span";
const Icon = forwardRef((props, ref) => {
    const { name, pathCount, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    return _jsx("div", { style: style, className: `icon-${name} ${className}`.trim(), ref: ref, ...rest, children: Array(pathCount || 0).fill(0).map((p, i) => _jsx(Span, { className: `path${i + 1}` }, `${name}-layer-${i}`)) });
});
export default Icon;
