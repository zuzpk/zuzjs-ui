"use client"
import { InputEventHandler, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { POSITION, SLIDER } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import Span from "../Span";
import ToolTip from "../Tooltip";
import { ToolTipController } from "../Tooltip/types";
import { SliderProps } from "./types";

const Slider = ({
    ref, 
    ...props
} : SliderProps) => {

    const { 
        type, 
        value: _value = 0, 
        min : _min = 0, 
        max : _max = 1, 
        step : _step = 0.01, 
        onChange,
        showGhostBar,
        showKnobOnHover,
        showToolTip,
        roundValue,
        formatValue,
        ...pops } = props;
    const {
        className,
        style,
        rest
    } = useBase(pops)
    const step = useRef<number>(_step || 0.01).current;
    const min = useRef<number>(_min || 0).current;
    const max = useRef<number>(_max || 1).current;
    const value = useRef<number>(_value || 0).current;
    const input = useRef<HTMLInputElement>(null)
    const slider = useRef<HTMLDivElement>(null)
    const knob = useRef<HTMLDivElement>(null)
    const ghost = useRef<HTMLDivElement>(null);
    const fill = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLDivElement>(null)
    const text = useRef<HTMLHeadingElement>(null)
    const tooltipTextRef = useRef<HTMLSpanElement>(null);
    const tooltip = useRef<ToolTipController>(null)

    const percent = (value : number, min : number, max : number) : number => ((value - min) / (max - min)) * 100;
    
    const handleInput : InputEventHandler<HTMLInputElement> = (e) => {
        
        if (slider.current) {
            const value = parseFloat(e.currentTarget.value);
            setTooltipValue(value)
            const percentage = percent(value, parseFloat(e.currentTarget.min), parseFloat(e.currentTarget.max))
            slider.current.style.setProperty(`--value`, `${percentage}`);
            slider.current.setAttribute(`data-value`, `${value}`);
            onChange && onChange(roundValue ? +value.toFixed(2): value);
        }

    }

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startValue, setStartValue] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const setTooltipValue = async (v: number | string) => {
        const displayValue = formatValue 
            ? formatValue(+v) 
            : (roundValue ? (+v).toFixed(2) : Math.round(+v));
        if ( tooltipTextRef.current ) {
            tooltipTextRef.current.textContent = String(displayValue);
        }
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartX(e.clientX);
        setStartValue(slider.current ? parseFloat(slider.current.getAttribute(`data-value`)!) : 0);
        document.body.style.cursor = `ew-resize`
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (isDragging) {
            const deltaX = e.clientX - startX;
            // Adjust value based on a sensitivity ratio (e.g., 100px = 1 full step or 10% of range)
            const range = max - min;
            const sensitivity = 200; // Pixels required to move across the whole range
            const change = (deltaX / sensitivity) * range;
            
            let newValue = Math.max(min, Math.min(startValue + change, max));
            
            // Snap to step
            newValue = Math.round(newValue / step) * step;
            setTooltipValue(newValue)

            if (slider.current) {
                const percentage = percent(newValue, min, max);
                slider.current.style.setProperty(`--value`, `${percentage}`);
                slider.current.setAttribute(`data-value`, `${newValue}`);
                if (text.current) text.current.textContent = roundValue ? newValue.toFixed(2) : newValue.toString();
                onChange && onChange(newValue);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = `auto`
    };

    const getPercent = (v: number) => ((v - min) / (max - min)) * 100;

    const handleMouseMoveTrack = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!slider.current) return;
        
        const rect = slider.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const mousePercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        // 1. Fixed Tooltip Value (Actual value, not percent!)
        if (showToolTip && tooltipTextRef.current) {
            const currentVal = input.current ? +input.current.value : _value;
            setTooltipValue(currentVal * 100); 
            // Note: CSS Anchors handle the 'x' position now, so no need for setPosition
        }

        // 2. Ghost Bar Logic
        if (showGhostBar) {
            const currentPercent = getPercent(input.current ? +input.current.value : _value);
            const start = Math.min(currentPercent, mousePercent);
            const width = Math.abs(mousePercent - currentPercent);
            slider.current.style.setProperty('--ghost-start', `${start}`);
            slider.current.style.setProperty('--ghost-width', `${width}`);
        }
    };

    const _handleMouseMoveTrack = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!props.showGhostBar || !slider.current) return;
        
        const rect = slider.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const currentPercent = percent(_value, min, max); // Where the knob is
        const mousePercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        // Update Tooltip only if enabled
        if (showToolTip && tooltipTextRef.current) {
            // const hoverVal = _min + (mousePercent / 100) * (_max - _min);
            // const displayValue = formatValue 
            //     ? formatValue(hoverVal) 
            //     : (roundValue ? hoverVal.toFixed(2) : Math.round(hoverVal));
            // tooltipTextRef.current.textContent = String(displayValue);
            // slider.current.style.setProperty('--mouse-x', `${mousePercent}%`);
            // setTooltipValue(getPercent(input.current ? +input.current.value : _value))
            setTooltipValue(currentPercent)
            // tooltip.current?.setPosition({ x, y: -36 })
        }

        if (showGhostBar) {
            const currentPercent = getPercent(input.current ? +input.current.value : _value);
            const start = Math.min(currentPercent, mousePercent);
            const width = Math.abs(mousePercent - currentPercent);
            slider.current.style.setProperty('--ghost-start', `${start}`);
            slider.current.style.setProperty('--ghost-width', `${width}`);
        }

        // Calculate the start point and the width of the ghost
        // const start = Math.min(currentPercent, mousePercent);
        // const width = Math.abs(mousePercent - currentPercent);

        // slider.current.style.setProperty('--ghost-start', `${start}`);
        // slider.current.style.setProperty('--ghost-width', `${width}`);
    };

    useEffect(() => {
        if (slider.current) {
            slider.current
                .style
                .setProperty(
                    `--value`, 
                    input.current ? 
                        `${percent(parseFloat(input.current.value), parseFloat(input.current.min), parseFloat(input.current.max))}`
                        : value.toString()
                );
        }
    }, [])

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    useEffect(() => {
        const percentage = percent(_value, min, max);
        slider.current?.style.setProperty(`--value`, `${percentage}`);
        setTooltipValue(_value)
    }, [_value, min, max, tooltipTextRef.current]);

    const renderSliderContent = () => (
        <Box
            ref={slider}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onMouseMove={handleMouseMoveTrack}
            className={`--slider --${type || SLIDER.Default} ${showKnobOnHover ? '--knob-hover' : ''} flex rel ${className}`.trim()}
            style={{ ...style }}>
            <Box ref={track} className={`--slider-track abs fill`} />
            {showGhostBar && <Box ref={ghost} className="--slider-ghost abs fill" />}
            <Box  className={`--slider-track-filled abs fill`} style={{ width: `calc(var(--value) * 1%)` }} />
            <Box ref={knob} className={`--slider-knob --tooltip-knob abs`} />

            <Input 
                ref={input}
                onInput={handleInput}
                className={`abs fill`}
                tabIndex={0}
                type={type || SLIDER.Default} 
                defaultValue={value || 0}
                step={step} 
                max={max} 
                min={min} />

        </Box>
    );

    if (showToolTip === true) {
        const initialTitle = formatValue ? formatValue(_value) : (roundValue ? _value.toFixed(2) : _value);
        return (
            <ToolTip 
                ref={tooltip}
                show={isDragging}
                position={POSITION.Top} 
                margin={15}
                anchorName="--tooltip-knob"
                title={<Span ref={tooltipTextRef}>{initialTitle}</Span>}
            >
                {renderSliderContent()}
            </ToolTip>
        );
    }

    return renderSliderContent();

}

Slider.displayName = `Zuz.Slider`

export default Slider