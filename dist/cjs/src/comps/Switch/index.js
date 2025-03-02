import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import CheckBox from "../CheckBox";
import { CHECKBOX } from "../../types/enums";
const Switch = forwardRef((props, ref) => {
    return _jsx(CheckBox, { type: CHECKBOX.Switch, ...props, ref: ref });
});
export default Switch;
