import { ReactNode } from "react";
import { animationProps } from "./base";
import { SHEET } from "../types/enums";
export interface SheetProps {
    as?: string;
    animate?: animationProps;
    title?: string;
    message?: string | ReactNode;
}
export interface SheetActionHandler {
    label: string;
    handler: () => void;
}
export interface SheetHandler {
    showDialog: (title: string | ReactNode, message: string | ReactNode, action?: SheetActionHandler, onShow?: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: SHEET) => void;
    hide: () => void;
}
declare const Sheet: import("react").ForwardRefExoticComponent<SheetProps & import("react").RefAttributes<SheetHandler>>;
export default Sheet;
