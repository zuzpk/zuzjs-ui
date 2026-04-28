import { InputProps } from "../Input/types";

export type ColorValue = {
    hex: string;
    rgb: { r: number; g: number; b: number };
    hsv: { h: number; s: number; v: number };
    alpha: number;
};

export type ColorPickerProps = Omit<InputProps, 'onChange'> & {
    defaultValue?: string;
    colorValue?: string;
    alpha?: boolean;
    format?: 'hex' | 'rgb';
    onColorChange?: (color: ColorValue) => void;
    kind?: 'square' | 'expanded';
};
