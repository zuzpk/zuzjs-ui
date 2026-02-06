import { ReactNode } from "react";
import { ALERT } from "../../types/enums";
import { BoxProps, ValueOf } from "../../types";

export type AlertProps = BoxProps &{
    type?: ValueOf<typeof ALERT>,
    icon?: string,
    iconSize?: number,
    message?: string | ReactNode,
    title: string | ReactNode,
    
}

export interface AlertHandler {
    open: () => void,
    close: () => void,
}