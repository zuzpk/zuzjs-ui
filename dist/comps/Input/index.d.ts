import { Props } from '../../types';
export type InputProps = Props<`input`> & {
    numeric?: boolean;
};
declare const Input: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../../types").ZuzProps> & {
    numeric?: boolean;
} & import("react").RefAttributes<HTMLInputElement>>;
export default Input;
