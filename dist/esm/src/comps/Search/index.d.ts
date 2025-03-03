import { InputProps } from '../Input';
import { Size } from '../../types/enums';
export type SearchProps = InputProps & {
    onSubmit?: (value: string) => void;
    onChange?: (value: string) => void;
    withStyle?: string;
};
declare const Search: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../..").ZuzProps> & {
    numeric?: boolean;
    size?: Size;
    variant?: import("../..").Variant;
    with?: import("../..").FORMVALIDATION;
} & {
    onSubmit?: (value: string) => void;
    onChange?: (value: string) => void;
    withStyle?: string;
} & import("react").RefAttributes<HTMLInputElement>>;
export default Search;
