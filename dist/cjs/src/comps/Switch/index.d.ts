import { CheckboxHandler } from "../CheckBox/types";
import { CHECKBOX } from "../../types/enums";
declare const Switch: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../..").ZuzProps> & {
    type?: CHECKBOX;
    size?: import("../..").Size;
    variant?: import("../..").Variant;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & import("react").RefAttributes<CheckboxHandler>>;
export default Switch;
