import { ALERT } from "../../types/enums";
import { BoxProps } from "../Box";

export type AlertProps = BoxProps &{
    type?: ALERT,
    icon?: string,
    iconSize?: number,
    message?: string,
    title: string,
    
}

export interface AlertHandler {
    open: () => void,
    close: () => void,
}