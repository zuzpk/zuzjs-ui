"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import With from "./base";
import { CHECKBOX } from "../types/enums";
const CheckBox = forwardRef((props, ref) => {
    const { as, name, required, type, value, checked: defaultCheck, onChange, ...rest } = props;
    const [checked, _setChecked] = useState(defaultCheck || false);
    const bRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange = true) {
            _setChecked(mod);
            if (bRef.current) {
                bRef.current.checked = mod;
            }
            if (triggerChange && onChange)
                onChange(mod, value || `cb`);
        },
        toggle(triggerChange = true) {
            if (bRef.current)
                bRef.current.checked = !checked;
            if (triggerChange && onChange)
                onChange && onChange(!checked, value || `cb`);
            _setChecked(!checked);
        }
    }));
    return _jsx(With, { tag: `label`, className: `${type == CHECKBOX.Default ? `checkbox icon-check` : `zuz-checkbox`} flex aic jcc ${checked ? `is-checked` : ``} rel`.trim(), as: as, ...rest, children: _jsx(With, { tag: `input`, ref: bRef, defaultChecked: checked, value: value || `cb`, type: `checkbox`, className: `abs`, name: name, required: required || false, onChange: (e) => {
                onChange && onChange(e.target.checked, value || `cb`);
                _setChecked(e.target.checked);
            } }) });
});
export default CheckBox;
