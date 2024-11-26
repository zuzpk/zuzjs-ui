"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useMemo, useState } from 'react';
import { useBase } from '../../hooks';
import Box from '../Box';
import Text from '../Text';
import { TRANSITION_CURVES } from '../../types/enums';
import { TOOLTIP } from './types';
const ToolTip = forwardRef((props, ref) => {
    const { title, dir, children, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const [hovered, setHovered] = useState(false);
    const dx = useMemo(() => dir || TOOLTIP.Bottom, []);
    return _jsxs(Box, { className: `--with-tooltip rel`, onMouseEnter: e => setHovered(true), onMouseLeave: e => setHovered(false), children: [_jsx(Box, { className: `--tooltip --${dir || TOOLTIP.Top} abs ${className}`.trim(), animate: {
                    from: dx == TOOLTIP.Bottom || dx == TOOLTIP.Top ?
                        { opacity: 0, x: `-50%`, y: dx == TOOLTIP.Top ? -5 : 5 }
                        : { opacity: 0, y: `-50%`, x: dx == TOOLTIP.Right ? `60%` : `-60%` },
                    to: dx == TOOLTIP.Bottom || dx == TOOLTIP.Top ?
                        { opacity: 1, x: `-50%`, y: 0 }
                        : { opacity: 1, y: `-50%`, x: dx == TOOLTIP.Right ? `55%` : `-55%` },
                    curve: TRANSITION_CURVES.EaseInOut,
                    when: hovered
                }, children: _jsx(Text, { className: `--text rel`, children: title }) }), children] });
});
export default ToolTip;
