"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import Input from '../Input';
import Box from '../Box';
const PinInput = forwardRef((props, ref) => {
    const { size, length, mask, ...pops } = props;
    const inputs = useRef([]);
    let name = `pinput`;
    let required = false;
    if (`type` in pops) {
        delete pops.type;
    }
    if (`name` in pops) {
        name = pops.name;
        delete pops.name;
    }
    if (`required` in pops) {
        required = true;
        delete pops.required;
    }
    const { style } = useBase(pops);
    const handleInput = (event) => {
        const input = event.currentTarget;
        const nextInput = inputs.current[parseInt(input.dataset.index) + 1];
        const prevInput = inputs.current[parseInt(input.dataset.index) - 1];
        if (input.value.length === 1 && nextInput) {
            nextInput.focus();
        }
        else if (input.value.length === 0 && prevInput) {
            prevInput.focus();
        }
    };
    useEffect(() => {
        inputs.current = inputs.current.slice(0, size || length);
    }, [size || length]);
    return _jsx(Box, { name: name, style: style, className: `--otp flex aic rel`, "data-required": required, "data-size": size || length || 4, children: Array(size || length || 4).fill(1).map((a, i) => _jsx(Input, { "data-index": i, ref: (el) => {
                inputs.current[i] = el;
            }, numeric: true, onChange: handleInput, maxLength: 1, placeholder: `0`, type: mask ? `password` : 'text', ...pops }, `pin-${i}`)) });
});
export default PinInput;
