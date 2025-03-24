import { ReactNode } from "react";
import { ALERT } from "../../types/enums";
import { BoxProps } from "../Box";

export type AlertProps = BoxProps &{
    type?: ALERT,
    icon?: string,
    iconSize?: number,
    message?: string | ReactNode,
    title: string | ReactNode,
    
}

export interface AlertHandler {
    open: () => void,
    close: () => void,
}