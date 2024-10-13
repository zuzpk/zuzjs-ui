import { ReactNode } from "react";
import { SHEET, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
import { BaseProps } from "../types/interfaces";
export interface SheetProps {
    title?: string;
    message?: string | ReactNode;
    transition?: TRANSITIONS;
    curve?: TRANSITION_CURVES;
    speed?: Number;
    type?: SHEET;
}
export interface SheetActionHandler {
    label: string;
    handler: () => void;
}
export interface SheetHandler {
    showDialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: SHEET) => void;
    hide: () => void;
}
declare const Sheet: import("react").ForwardRefExoticComponent<SheetProps & BaseProps & import("react").RefAttributes<SheetHandler>>;
export default Sheet;
