import { Size, SPINNER } from "../../types/enums";
import { BoxProps } from "../Box";
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
