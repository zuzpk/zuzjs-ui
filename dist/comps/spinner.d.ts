import { ComponentPropsWithoutRef } from "react";
import { animationProps } from "./base";
import { SPINNER } from "../types/enums";
export interface SpinnerProps extends ComponentPropsWithoutRef<`div`> {
    as?: string;
    animate?: animationProps;
    type?: SPINNER;
    size?: number;
    width?: number;
    color?: string;
    background?: string;
    foreground?: string;
    speed?: number;
}
declare const Spinner: import("react").ForwardRefExoticComponent<SpinnerProps & import("react").RefAttributes<HTMLDivElement>>;
export default Spinner;
