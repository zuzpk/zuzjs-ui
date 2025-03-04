import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { CHECKBOX } from "../../types/enums";
import CheckBox from "../CheckBox";
const Switch = forwardRef((props, ref) => {
    return _jsx(CheckBox, { type: CHECKBOX.Switch, ...props, ref: ref });
});
Switch.displayName = `Switch`;
export default Switch;
