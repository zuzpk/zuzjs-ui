import { BoxProps } from "../../types";

export type TextWheelProps = Omit<BoxProps, "name"> &  { 
    value?: number | string, 
    color?: string, 
    direction?: `up` | `down`, 
    charDelay?: number | ((index: number) => number),
    charDuration?: number | ((index: number) => number),
}
  
export interface TextWheelHandler {
    setValue: ( v: number | string ) => void,
    updateValue: ( v: number | string ) => void,
}
  