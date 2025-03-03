'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useRef, useState } from "react";
import Label from "../Label";
import { RADIO, Size } from "../../types/enums";
import Input from "../Input";
import Box from "../Box";
const Radio = forwardRef((props, ref) => {
    const { children, className, name, required, type, value, size, checked: defaultCheck, onSwitch, ...pops } = props;
    const [checked, _setChecked] = useState(defaultCheck || false);
    const bRef = useRef(null);
    return _jsxs(Label, { className: `${className} --${(type || RADIO.Default).toLowerCase()} --radio${!type || type == RADIO.Default ? `` : `card`} --${size || Size.Default} flex aic rel`.trim(), ...pops, children: [_jsx(Input, { ...{}, ref: bRef, defaultChecked: checked, value: value || `rd`, type: `radio`, className: `abs`, name: name, required: required || false, onChange: (e) => {
                    console.log(`from p trigger`);
                    onSwitch && onSwitch(e.target.checked, value || `cb`);
                    _setChecked(e.target.checked);
                } }), _jsx(Box, { className: `--dot rel`, children: _jsx(Box, { className: `--rod abs abc` }) }), _jsx(Box, { className: `--value`, children: children })] });
});
export default Radio;
