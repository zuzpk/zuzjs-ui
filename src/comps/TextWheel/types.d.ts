import { BoxProps } from "../Box";
export type TextWheelProps = Omit<BoxProps, "name"> & {
    value?: number | string;
    color?: string;
    direction?: `up` | `down`;
};
export interface TextWheelHandler {
    setValue: (v: number | string) => void;
    updateValue: (v: number | string) => void;
}
