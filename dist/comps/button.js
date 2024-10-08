import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Button = forwardRef((props, ref) => {
    const { as, icon, ...rest } = props;
    return _jsxs(With, { tag: `button`, as: as, className: `flex aic ${icon ? `ico-btn` : ``}`.trim(), ...rest, ref: ref, children: [icon && _jsx(With, { className: `icon-${icon}` }), _jsx(With, { tag: `span`, className: `b-label`, children: props.children })] });
});
export default Button;
