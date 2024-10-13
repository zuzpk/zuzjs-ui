import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Input = forwardRef((props, ref) => {
    const { as, textarea, value, ...rest } = props;
    return textarea ? _jsx(With, { tag: `textarea`, as: as, ...rest, value: value, ref: ref })
        : _jsx(With, { tag: `input`, as: as, value: value, ...rest, ref: ref });
});
export default Input;
