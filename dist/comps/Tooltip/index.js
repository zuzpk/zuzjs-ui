"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from 'react';
import { useBase } from '../../hooks';
import Box from '../Box';
import Text from '../Text';
import { TRANSITION_CURVES } from '../../types/enums';
const ToolTip = forwardRef((props, ref) => {
    const { title, children, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const [hovered, setHovered] = useState(false);
    return _jsxs(Box, { className: `--with-tooltip rel`, onMouseEnter: e => setHovered(true), onMouseLeave: e => setHovered(false), children: [_jsx(Box, { className: `--tooltip abs ${className}`.trim(), animate: {
                    from: { opacity: 0, x: `-50%`, y: -5 },
                    to: { opacity: 1, x: `-50%`, y: 0 },
                    curve: TRANSITION_CURVES.EaseInOut,
                    when: hovered
                }, children: _jsx(Text, { className: `--text rel`, children: title }) }), children] });
});
export default ToolTip;
