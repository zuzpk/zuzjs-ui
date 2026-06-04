import { ReactNode } from "react";
import { Appearance, BoxProps, ValueOf } from "../../types";
import { ALERT, Variant } from "../../types/enums";

export type AlertProps = BoxProps &{
    type?: ValueOf<typeof ALERT>,
    icon?: string,
    iconSize?: number,
    message?: string | ReactNode,
    title: string | ReactNode,
    variant?: ValueOf<typeof Variant>,
    actions?: ReactNode | {
        label: string;
        icon?: string | null;
        kind?: Appearance,
        onClick: () => void;
    }[]
    
}

export interface AlertHandler {
    open: () => void,
    close: () => void,
}