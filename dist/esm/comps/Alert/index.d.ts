import { AlertHandler } from "./types";
import { ALERT } from "../../types/enums";
import { BoxProps } from "../Box";
declare const Alert: import("react").ForwardRefExoticComponent<BoxProps & {
    type?: ALERT;
    icon?: string;
    iconSize?: number;
    message?: string;
    title: string;
} & import("react").RefAttributes<AlertHandler>>;
export default Alert;
