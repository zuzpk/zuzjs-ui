import { animationProps } from "./base";
import { FORMVALIDATION } from "../types/enums";
import { dynamicObject } from "../types";
export interface SelectProps {
    as?: string;
    name?: string;
    animate?: animationProps;
    required?: FORMVALIDATION;
    options: dynamicObject[];
    label?: string;
    defaultValue?: string | dynamicObject;
    onChange?: (v: string | dynamicObject) => void;
}
export interface SelectHandler {
    onChange?: (v: string | dynamicObject) => void;
}
declare const Select: import("react").ForwardRefExoticComponent<SelectProps & import("react").RefAttributes<SelectHandler>>;
export default Select;
