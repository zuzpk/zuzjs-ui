import { ReactNode } from "react";
import { ZuzProps } from "../../types/interfaces";
import { ValueOf } from "../../types";
import { SHEET, TRANSITION_CURVES, TRANSITIONS, DIALOG_ACTION_POSITION, DIALOG, Variant } from "../../types/enums";
import { SPINNER } from "../Spinner/types";

export type DialogProps = ZuzProps & {
    id?: number,
    title?: string | ReactNode,
    message?: string | ReactNode,
    transition?: ValueOf<typeof TRANSITIONS>,
    curve?: ValueOf<typeof TRANSITION_CURVES>,
    speed?: number,
    delay?: number,
    type?: ValueOf<typeof DIALOG>,
    spinner?: ValueOf<typeof SPINNER>,
    loadingMessage?: string,
    action?: DialogActionHandler[],
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>,
    variant?: ValueOf<typeof Variant>,
    onShow?: () => void,
    onHide?: () => void,
}
export interface DialogActionHandler {
    key?: string,
    label: string, 
    handler?: () => void,
    onClick?: () => void,
}

export interface DialogHandler {
    setLoading: ( mode: boolean ) => void,
    dialog: ( 
        title : string | ReactNode, 
        message : string | ReactNode, 
        action? : DialogActionHandler[], 
        onShow?: () => void 
    ) => void,
    show: ( message : string | ReactNode, duration?: number, type?: ValueOf<typeof SHEET> ) => void,
    success: ( message : string | ReactNode, duration?: number ) => void,
    error: ( message : string | ReactNode, duration?: number ) => void,
    warn: ( message : string | ReactNode, duration?: number ) => void,
    hide: () => void,
}