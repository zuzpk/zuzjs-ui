import { Size, SPINNER } from '../../types/enums';
import { ButtonState } from './types';
declare const Button: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, keyof import("../..").ZuzProps> & {
    icon?: string;
    iconSize?: Size;
    withLabel?: boolean;
    spinner?: SPINNER;
    state?: ButtonState;
    size?: Size;
    variant?: Size | import("../..").Variant;
    reset?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export default Button;
