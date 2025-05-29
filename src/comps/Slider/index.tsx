"use client"
import { FormEvent, forwardRef, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { SLIDER } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import Input from "../Input";
import Text from "../Text";

export type SliderProps = BoxProps & {
    type?: SLIDER,
    value?: number,
    min?: number,
    max?: number,
    step?: number,
    roundValue?: boolean,
    onChange?: (value: number) => void,
}

const Slider = forwardRef<HTMLInputElement, SliderProps >((props, ref) => {

    const { 
        type, 
        value: _value, 
        min : _min, 
        max : _max, 
        step : _step, 
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
    const fill = useRef<HTMLDivElement>(null)
    const track = useRef<HTMLDivElement>(null)
    const text = useRef<HTMLHeadingElement>(null)

    const percent = (value : number, min : number, max : number) : number => ((value - min) / (max - min)) * 100;
    
    const handleInput = (e : FormEvent<HTMLInputElement> ) => {
        
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
            const newValue = Math.max(min, Math.min(startValue + deltaX * step, max)); // Adjust sensitivity as needed
            if (slider.current) {
                slider.current.setAttribute(`data-value`, `${newValue}`);
                text.current!.textContent = roundValue ? newValue.toFixed(2) : newValue.toString();
                onChange && onChange(roundValue ? +newValue.toFixed(2) : newValue);
            }
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.cursor = `auto`
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


    return <Box
        ref={slider}
        data-value={value || 0}
        className={`--slider --${type || SLIDER.Default} flex rel ${className}`.trim()}
        style={{ ...style }}>

        {SLIDER.Text === type ? <>
            <Text 
                ref={text}
                onMouseDown={handleMouseDown}    
                className={`--slider-text`}>{value || 0}</Text> 
        </> : <>
            <Box ref={track} className={`--slider-track abs fill`} />
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