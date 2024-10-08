import { animationProps } from "./base";
export interface ButtonProps {
    as?: string;
    animate?: animationProps;
    icon?: string;
}
declare const Button: import("react").ForwardRefExoticComponent<ButtonProps & Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref"> & import("react").RefAttributes<HTMLButtonElement>>;
export default Button;
