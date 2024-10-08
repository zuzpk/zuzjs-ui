import React from 'react';
import { animationProps } from "./base";
export interface WheelProps {
    as?: string;
    direction?: `up` | `down`;
    value?: number | string;
    color?: string;
    animate?: animationProps;
}
export interface WheelHandler {
    setValue: (v: number | string) => void;
    updateValue: (v: number | string) => void;
}
declare const TextWheel: React.ForwardRefExoticComponent<WheelProps & React.RefAttributes<WheelHandler>>;
export default TextWheel;
