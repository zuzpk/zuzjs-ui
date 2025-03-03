import { BoxProps } from "../Box";
import { SLIDER } from "../../types/enums";
export type SliderProps = BoxProps & {
    type?: SLIDER;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    roundValue?: boolean;
    onChange?: (value: number) => void;
};
declare const Slider: import("react").ForwardRefExoticComponent<BoxProps & {
    type?: SLIDER;
    value?: number;
    min?: number;
    max?: number;
    step?: number;
    roundValue?: boolean;
    onChange?: (value: number) => void;
} & import("react").RefAttributes<HTMLInputElement>>;
export default Slider;
