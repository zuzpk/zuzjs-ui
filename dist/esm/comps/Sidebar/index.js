import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import Box from "../Box";
const Sidebar = forwardRef((props, ref) => {
    const { layout, logo } = props;
    return _jsxs(Box, { ref: ref, className: `--sidebar --${layout || `2-columns`} flex cols`, children: [_jsx(Box, { as: `--logo`, children: logo }), _jsx(Box, { as: `--nav flex cols` })] });
});
Sidebar.displayName = `Sidebar`;
export default Sidebar;
