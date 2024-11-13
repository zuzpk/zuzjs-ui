import { InputProps } from '../Input';
export type PinInputProps = InputProps & {
    mask?: boolean;
    size?: number;
};
declare const PinInput: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../../types").ZuzProps> & {
    numeric?: boolean;
} & {
    mask?: boolean;
    size?: number;
} & import("react").RefAttributes<HTMLInputElement>>;
export default PinInput;
