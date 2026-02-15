import { ReactNode } from "react";
import { ValueOf } from "../../types";
import { DIALOG, DIALOG_ACTION_POSITION, SHEET, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import { LayerHandler, ZuzProps } from "../../types/interfaces";
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
} & LayerHandler
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