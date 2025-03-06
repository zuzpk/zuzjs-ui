import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase, useScrollbar } from "../../hooks";
import Box from "../Box";
const ScrollView = forwardRef((props, ref) => {
    const { speed, style: _style, ...pops } = props;
    const { rootRef, containerRef, thumbRef, handleDragStart } = useScrollbar();
    const { style, className, rest } = useBase(pops);
    return _jsxs(Box, { ref: rootRef, className: className.trim(), as: `--scrollview rel`, children: [_jsx(Box, { as: `--scroll-content`, ref: containerRef, style: _style || {}, children: rest.children }), _jsx(Box, { as: `--scroll-track abs`, children: _jsx(Box, { as: `--scroll-thumb`, ref: thumbRef, onMouseDown: handleDragStart }) })] });
});
ScrollView.displayName = `ScrollView`;
export default ScrollView;
