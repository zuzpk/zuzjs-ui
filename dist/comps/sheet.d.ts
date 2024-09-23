import { ReactNode } from "react";
import { animationProps } from "./base";
import { SHEET } from "../types/enums";
export interface SheetProps {
    as?: string;
    animate?: animationProps;
    title?: string;
    message?: string | ReactNode;
}
export interface SheetHandler {
    showDialog: (message: string | ReactNode, onShow: () => void) => void;
    show: (message: string | ReactNode, duration?: number, type?: SHEET) => void;
    hide: () => void;
}
declare const Sheet: import("react").ForwardRefExoticComponent<SheetProps & import("react").RefAttributes<SheetHandler>>;
export default Sheet;
