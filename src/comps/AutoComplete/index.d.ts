import { Size } from "../../types/enums";
declare const AutoComplete: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../..").ZuzProps> & {
    numeric?: boolean;
    size?: Size;
    variant?: import("../..").Variant;
    with?: import("../..").FORMVALIDATION;
} & {
    action?: string;
    data?: string[];
    withStyle?: string;
} & import("react").RefAttributes<HTMLDivElement>>;
export default AutoComplete;
