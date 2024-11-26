import { BoxProps } from "../Box";
import { Size, SPINNER } from "../../types/enums";
export type SpinnerProps = BoxProps & {
    type?: SPINNER;
    size?: Size | number;
    width?: number;
    color?: string;
    background?: string;
    foreground?: string;
    speed?: number;
};
declare const Spinner: import("react").ForwardRefExoticComponent<BoxProps & {
    type?: SPINNER;
    size?: Size | number;
    width?: number;
    color?: string;
    background?: string;
    foreground?: string;
    speed?: number;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Spinner;
