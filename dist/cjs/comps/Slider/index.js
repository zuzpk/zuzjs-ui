"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { SLIDER } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import Text from "../Text";
const Slider = forwardRef((props, ref) => {
    const { type, value: _value, min: _min, max: _max, step: _step, onChange, roundValue, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const step = useRef(_step || 0.01).current;
    const min = useRef(_min || 0).current;
    const max = useRef(_max || 1).current;
    const value = useRef(_value || 0).current;
    const input = useRef(null);
    const slider = useRef(null);
    const knob = useRef(null);
    const fill = useRef(null);
    const track = useRef(null);
    const text = useRef(null);
    const percent = (value, min, max) => ((value - min) / (max - min)) * 100;
    const handleInput = (e) => {
        if (slider.current) {
            const value = parseFloat(e.currentTarget.value);
            const percentage = percent(value, parseFloat(e.currentTarget.min), parseFloat(e.currentTarget.max));
            slider.current.style.setProperty(`--value`, `${percentage}`);
            slider.current.setAttribute(`data-value`, `${value}`);
            onChange && onChange(roundValue ? +value.toFixed(2) : value);
        }
    };
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const handleMouseDown = (e) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setStartValue(slider.current ? parseFloat(slider.current.getAttribute(`data-value`)) : 0);
        document.body.style.cursor = `ew-resize`;
    };
    const handleMouseMove = (e) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            const newValue = Math.max(min, Math.min(startValue + deltaX * step, max)); // Adjust sensitivity as needed
            if (slider.current) {
                slider.current.setAttribute(`data-value`, `${newValue}`);
                text.current.textContent = roundValue ? newValue.toFixed(2) : newValue.toString();
                onChange && onChange(roundValue ? +newValue.toFixed(2) : newValue);
            }
        }
    };
    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = `auto`;
    };
    useEffect(() => {
        if (slider.current) {
            slider.current
                .style
                .setProperty(`--value`, input.current ?
                `${percent(parseFloat(input.current.value), parseFloat(input.current.min), parseFloat(input.current.max))}`
                : value.toString());
        }
    }, []);
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);
    return _jsx(Box, { ref: slider, "data-value": value || 0, className: `--slider --${type || SLIDER.Default} flex rel ${className}`.trim(), style: { ...style }, children: SLIDER.Text === type ? _jsx(_Fragment, { children: _jsx(Text, { ref: text, onMouseDown: handleMouseDown, className: `--slider-text`, children: value || 0 }) }) : _jsxs(_Fragment, { children: [_jsx(Box, { ref: track, className: `--slider-track abs fill` }), _jsx(Box, { ref: knob, className: `--slider-knob abs` }), _jsx(Input, { ref: input, onInput: handleInput, className: `abs fill`, tabIndex: 0, type: type || SLIDER.Default, defaultValue: value || 0, step: step, max: max, min: min })] }) });
});
Slider.displayName = `Slider`;
export default Slider;
