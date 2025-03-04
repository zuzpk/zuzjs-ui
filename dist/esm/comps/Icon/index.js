"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { Size } from "../../types/enums";
import Span from "../Span";
const Icon = forwardRef((props, ref) => {
    const { name, pathCount, size, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    return _jsx("div", { style: style, className: `icon-${name} --icon --${size || Size.Default} ${className}`.trim(), ref: ref, ...rest, children: Array(pathCount || 0).fill(0).map((p, i) => _jsx(Span, { className: `path${i + 1}` }, `${name}-layer-${i}`)) });
});
Icon.displayName = `Icon`;
export default Icon;
