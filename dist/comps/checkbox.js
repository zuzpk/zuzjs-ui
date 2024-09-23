"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useState } from "react";
import With from "./base";
const CheckBox = forwardRef((props, ref) => {
    const { as, name, required, ...rest } = props;
    const [checked, setChecked] = useState(props.checked || false);
    return _jsx(With, { tag: `label`, className: `zuz-checkbox${checked ? ` is-checked` : ``} rel`, as: as, ...rest, children: _jsx(With, { tag: `input`, ref: ref, type: `checkbox`, className: `abs`, name: name, required: required || false, onChange: (e) => setChecked(e.target.checked) }) });
});
export default CheckBox;
