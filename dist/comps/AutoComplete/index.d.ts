import { Size } from "../../types/enums";
declare const AutoComplete: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../../types").ZuzProps> & {
    numeric?: boolean;
    size?: Size;
    variant?: import("../../types/enums").Variant;
    with?: import("../../types/enums").FORMVALIDATION;
} & {
    action?: string;
    data?: string[];
    withStyle?: string;
} & import("react").RefAttributes<HTMLDivElement>>;
export default AutoComplete;
