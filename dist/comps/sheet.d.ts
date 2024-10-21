import { ReactNode } from "react";
import { SHEET, SHEET_ACTION_POSITION, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
import { BaseProps } from "../types/interfaces";
export interface SheetProps {
    title?: string;
    message?: string | ReactNode;
    transition?: TRANSITIONS;
    curve?: TRANSITION_CURVES;
    speed?: Number;
    type?: SHEET;
    actionPosition?: SHEET_ACTION_POSITION;
}
export interface SheetActionHandler {
    key?: string;
    label: string;
    handler?: () => void;
    onClick?: () => void;
}
export interface SheetHandler {
    showDialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: SHEET) => void;
    hide: () => void;
}
declare const Sheet: import("react").ForwardRefExoticComponent<SheetProps & BaseProps & import("react").RefAttributes<SheetHandler>>;
export default Sheet;
