import { animationProps } from "./base";
import { FORMVALIDATION } from "../types/enums";
declare const Input: import("react").ForwardRefExoticComponent<{
    required?: FORMVALIDATION;
    as?: string;
    animate?: animationProps;
} & Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref"> & import("react").RefAttributes<HTMLInputElement>>;
export default Input;
