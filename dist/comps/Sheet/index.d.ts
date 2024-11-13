import { ReactNode } from "react";
import { SHEET, SHEET_ACTION_POSITION, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import { ZuzProps } from "../../types";
export type SheetProps = ZuzProps & {
    title?: string;
    message?: string | ReactNode;
    transition?: TRANSITIONS;
    curve?: TRANSITION_CURVES;
    speed?: Number;
    type?: SHEET;
    actionPosition?: SHEET_ACTION_POSITION;
};
export interface SheetActionHandler {
    key?: string;
    label: string;
    handler?: () => void;
    onClick?: () => void;
}
export interface SheetHandler {
    showDialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    dialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler[], onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: SHEET) => void;
    success: (message: string | ReactNode, duration?: number) => void;
    error: (message: string | ReactNode, duration?: number) => void;
    warn: (message: string | ReactNode, duration?: number) => void;
    hide: () => void;
}
declare const Sheet: import("react").ForwardRefExoticComponent<ZuzProps & {
    title?: string;
    message?: string | ReactNode;
    transition?: TRANSITIONS;
    curve?: TRANSITION_CURVES;
    speed?: Number;
    type?: SHEET;
    actionPosition?: SHEET_ACTION_POSITION;
} & import("react").RefAttributes<SheetHandler>>;
export default Sheet;