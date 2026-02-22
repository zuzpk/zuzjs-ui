"use client"
import { forwardRef, InputEventHandler, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { BoxProps, ValueOf } from "../../types";
import { SLIDER } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import Text from "../Text";

export type SliderProps = BoxProps & {
    type?: ValueOf<typeof SLIDER>,
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    roundValue?: boolean,
    showKnobOnHover?: boolean,
    showGhostBar?: boolean,
    showToolTip?: boolean,
    formatValue?: (value: number) => string | number,
    onChange?: (value: number) => void,
}

const Slider = forwardRef<HTMLInputElement, SliderProps >((props, ref) => {

    const { 
        type, 
        value: _value = 0, 
        min : _min = 0, 
        max : _max = 1, 
        step : _step = 0.01, 
        onChange,
        roundValue,
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

    const percent = (value : number, min : number, max : number) : number => ((value - min) / (max - min)) * 100;
    
    const handleInput : InputEventHandler<HTMLInputElement> = (e) => {
        
        if (slider.current) {
            const value = parseFloat(e.currentTarget.value);
            const percentage = percent(value, parseFloat(e.currentTarget.min), parseFloat(e.currentTarget.max))
            slider.current.style.setProperty(`--value`, `${percentage}`);
            slider.current.setAttribute(`data-value`, `${value}`);
            onChange && onChange(roundValue ? +value.toFixed(2): value);
        }

    }

    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [startValue, setStartValue] = useState(0);

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

    const handleMouseMoveTrack = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!props.showGhostBar || !slider.current) return;
        
        const rect = slider.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const currentPercent = percent(_value, min, max); // Where the knob is
        const mousePercent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        
        // Calculate the start point and the width of the ghost
        const start = Math.min(currentPercent, mousePercent);
        const width = Math.abs(mousePercent - currentPercent);

        slider.current.style.setProperty('--ghost-start', `${start}`);
        slider.current.style.setProperty('--ghost-width', `${width}`);
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
    }, [_value, min, max]);

    return <Box
        ref={slider}
        data-value={value || 0}
        onMouseMove={handleMouseMoveTrack}
        className={`--slider --${type || SLIDER.Default} ${props.showKnobOnHover === true ? '--knob-hover' : ''} flex rel ${className}`.trim()}
        style={{ ...style }}>

        {SLIDER.Text === type ? <>
            <Text 
                ref={text}
                onMouseDown={handleMouseDown}    
                className={`--slider-text`}>{value || 0}</Text> 
        </> : <>
            {/* Ghost Bar */}
            {props.showGhostBar && <Box ref={ghost} className="--slider-ghost abs fill" />}
            {/* Track bar */}
            <Box ref={track} className={`--slider-track abs fill`} />
            <Box ref={track} className={`--slider-track-filled abs fill`} />
            {/* Knob */}
            <Box ref={knob} className={`--slider-knob abs`} />
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
        </>}

        
        

    </Box>

})

Slider.displayName = `Zuz.Slider`

export default Slider