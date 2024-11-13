import { Props } from '../../types';
export type ButtonProps = Props<`button`> & {
    icon?: string;
    withLabel?: boolean;
};
declare const Button: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, "ref">, keyof import("../../types").ZuzProps> & {
    icon?: string;
    withLabel?: boolean;
} & import("react").RefAttributes<HTMLButtonElement>>;
export default Button;
