import { animationProps } from "./base";
import { CHECKBOX } from "../types/enums";
export interface CheckboxProps {
    as?: string;
    type?: CHECKBOX;
    required?: boolean;
    name?: string;
    value?: string;
    checked?: boolean;
    onChange?: (checked: boolean, value: string | string[]) => void;
    animate?: animationProps;
}
export interface CheckboxHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void;
    toggle: (triggerChange?: boolean) => void;
}
declare const CheckBox: import("react").ForwardRefExoticComponent<CheckboxProps & import("react").RefAttributes<CheckboxHandler>>;
export default CheckBox;
