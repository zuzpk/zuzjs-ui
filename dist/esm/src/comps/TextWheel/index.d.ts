import React from 'react';
import { TextWheelHandler } from './types';
declare const TextWheel: React.ForwardRefExoticComponent<Omit<import("..").BoxProps, "name"> & {
    value?: number | string;
    color?: string;
    direction?: `up` | `down`;
} & React.RefAttributes<TextWheelHandler>>;
export default TextWheel;
