import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Icon = forwardRef((props, ref) => {
    const { as, name, ...rest } = props;
    return _jsx(With, { className: `icon-${name}`, as: as, ...rest, ref: ref });
});
export default Icon;
