import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const ContextMenu = forwardRef((props, ref) => {
    const { as, items, ...rest } = props;
    return _jsx(With, { as: as, className: `zuz-context-menu abs flex cols`, ...rest, ref: ref, children: items.map((item, index) => item.label == `-` ? _jsx(With, { as: `context-line` }, `${index}-line`) :
            _jsxs(With, { onClick: item.onSelect, as: `button`, className: `context-menu-item flex aic ${item.className || ``}`.trim(), children: [_jsx(With, { as: `div`, className: `ico icon-${item.icon}`.trim(), style: item.iconColor ? { color: item.iconColor } : {} }), _jsx(With, { as: `h1`, className: `flex aic`, style: item.labelColor ? { color: item.labelColor } : {}, children: item.label })] }, `item-${item.label.replace(/\s/g, `-`)}-${index}`)) });
});
export default ContextMenu;
