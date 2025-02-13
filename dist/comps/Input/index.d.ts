import { Props } from '../../types';
import { FORMVALIDATION, Size } from '../../types/enums';
export type InputProps = Props<`input`> & {
    numeric?: boolean;
    size?: Size;
    variant?: Size;
    with?: FORMVALIDATION;
};
declare const Input: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../../types").ZuzProps> & {
    numeric?: boolean;
    size?: Size;
    variant?: Size;
    with?: FORMVALIDATION;
} & import("react").RefAttributes<HTMLInputElement>>;
export default Input;
