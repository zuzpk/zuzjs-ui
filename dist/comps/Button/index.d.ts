import { ButtonState } from './types';
import { Size } from '../../types/enums';
declare const Button: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, keyof import("../../types").ZuzProps> & {
    icon?: string;
    iconSize?: Size;
    withLabel?: boolean;
    spinner?: import("../Spinner").SpinnerProps;
    state?: ButtonState;
    size?: Size;
    variant?: Size | import("../../types/enums").Variant;
    reset?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export default Button;
