import { CHECKBOX } from "../../types/enums";
import { CheckboxHandler } from "./types";
declare const CheckBox: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../..").ZuzProps> & {
    type?: CHECKBOX;
    onChange?: (checked: boolean, value: string | number | readonly string[]) => void;
} & import("react").RefAttributes<CheckboxHandler>>;
export default CheckBox;
