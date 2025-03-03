import { RadioHandler } from "./types";
import { RADIO, Size } from "../../types/enums";
declare const Radio: import("react").ForwardRefExoticComponent<import("../..").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, "ref">, keyof import("../..").ZuzProps> & {
    type?: RADIO;
    size?: Size;
    onSwitch?: (checked: boolean, value: string | number | readonly string[]) => void;
} & import("react").RefAttributes<RadioHandler>>;
export default Radio;
