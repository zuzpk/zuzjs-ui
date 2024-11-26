import { Size } from '../../types/enums';
declare const Button: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, keyof import("../../types").ZuzProps> & {
    icon?: string;
    iconSize?: Size;
    withLabel?: boolean;
    spinner?: import("../Spinner").SpinnerProps;
} & import("react").RefAttributes<unknown>>;
export default Button;
