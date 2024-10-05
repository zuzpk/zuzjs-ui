import React from 'react';
import { animationProps } from "./base";
declare const TextWheel: React.ForwardRefExoticComponent<{
    as?: string;
    direction?: `up` | `down`;
    value: number | string;
    color?: string;
    animate?: animationProps;
} & Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & React.RefAttributes<HTMLDivElement>>;
export default TextWheel;
