"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CHECKBOX, Variant } from "../../types/enums";
import Input from "../Input";
import Label from "../Label";
import SVGIcons from "../svgicons";
const CheckBox = forwardRef((props, ref) => {
    const { name, required, type, value, size, variant, checked: defaultCheck, onSwitch, ...pops } = props;
    const [checked, _setChecked] = useState(defaultCheck || false);
    const bRef = useRef(null);
    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange = true) {
            _setChecked(mod);
            if (bRef.current) {
                bRef.current.checked = mod;
            }
            if (triggerChange && onSwitch)
                onSwitch(mod, value || `cb`);
        },
        toggle(triggerChange = true) {
            if (bRef.current)
                bRef.current.checked = !checked;
            if (triggerChange && onSwitch)
                onSwitch && onSwitch(!checked, value || `cb`);
            _setChecked(!checked);
        }
    }));
    return _jsxs(Label, { className: `--${(type || CHECKBOX.Default).toLowerCase()} ${!type || type == CHECKBOX.Default ? `--checkbox` : `--switch`} --${(variant || size) || Variant.Default} flex aic jcc ${checked ? `is-checked` : ``} rel`.trim(), ...pops, children: [(!type || type == CHECKBOX.Default) && SVGIcons.check, _jsx(Input, { ...{}, ref: bRef, defaultChecked: checked, value: value || `cb`, type: `checkbox`, className: `abs`, name: name, required: required || false, onChange: (e) => {
                    onSwitch && onSwitch(e.target.checked, value || `cb`);
                    _setChecked(e.target.checked);
                } })] });
});
CheckBox.displayName = `CheckBox`;
export default CheckBox;
