"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import { useBase, useDimensions } from '../../hooks';
import { Position, TRANSITION_CURVES } from '../../types/enums';
import Box from '../Box';
import Text from '../Text';
const ToolTip = forwardRef((props, ref) => {
    const { title, position, margin, children, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const [hovered, setHovered] = useState(false);
    const dx = useMemo(() => position || Position.Top, []);
    const tooltipWrapper = useRef(null);
    const tooltip = useRef(null);
    const handleObserve = (entries) => { };
    const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(handleObserve) : { observe: () => { }, unobserve: () => { } };
    const resize = useDimensions();
    const pos = useMemo(() => {
        if (!tooltip.current)
            return { left: 0, top: 0 };
        const firstChild = tooltip.current.previousElementSibling;
        if (firstChild) {
            const bc = firstChild.getBoundingClientRect();
            observer.observe(firstChild);
            // console.log(bc)
            switch (dx) {
                case Position.Top:
                    return { left: bc.left + bc.width / 2, top: bc.top - (margin || 25) };
                case Position.Bottom:
                    return { left: bc.left + bc.width / 2, top: bc.top + (margin || 25) };
                case Position.Left:
                    return { left: bc.left - bc.width / 2, top: bc.top + bc.height / 2 };
                case Position.Right:
                    return { left: bc.right, top: bc.top + bc.height / 2 };
                default:
                    return { left: 0, top: 0 };
            }
        }
    }, [tooltip.current, resize, observer]);
    useEffect(() => {
    }, []);
    return _jsxs(Box, { ref: tooltipWrapper, className: `--with-tooltip rel`, onMouseEnter: e => setHovered(true), onMouseLeave: e => setHovered(false), children: [children, _jsx(Box, { ref: tooltip, style: {
                    left: pos?.left + "px",
                    top: pos?.top + "px"
                }, className: `--tooltip --${position || Position.Top} fixed ${className}`.trim(), animate: {
                    from: dx == Position.Bottom || dx == Position.Top ?
                        { opacity: 0, x: `-50%`, y: dx == Position.Top ? -5 : 5 }
                        : { opacity: 0, y: `-50%`, x: dx == Position.Right ? 15 : -25 },
                    to: dx == Position.Bottom || dx == Position.Top ?
                        { opacity: 1, x: `-50%`, y: 0 }
                        : { opacity: 1, y: `-50%`, x: dx == Position.Right ? 10 : -20 },
                    curve: TRANSITION_CURVES.EaseInOut,
                    when: hovered
                }, children: _jsx(Text, { className: `--text rel`, children: title }) })] });
});
ToolTip.displayName = `ToolTip`;
export default ToolTip;
