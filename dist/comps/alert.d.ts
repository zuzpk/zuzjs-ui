import { BaseProps } from "../types/interfaces";
import { ALERT } from "../types/enums";
export interface AlertProps {
    type?: ALERT;
    icon?: string;
    iconSize?: number;
    message?: string;
    title: string;
}
export interface AlertHandler {
    open: () => void;
    close: () => void;
}
declare const Alert: import("react").ForwardRefExoticComponent<AlertProps & BaseProps & import("react").RefAttributes<AlertHandler>>;
export default Alert;
