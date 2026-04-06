import { dynamic } from "@zuzjs/core";
import { ReactNode } from "react";
import { ValueOf } from "../../types";
import { DIALOG, DIALOG_ACTION_POSITION, SHEET, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import { LayerHandler, ZuzProps } from "../../types/interfaces";
import { ButtonKind } from "../Button/types";
import { FormProps, ValidationResult } from "../Form/types";
import { SPINNER } from "../Spinner/types";

export type DialogProps = ZuzProps & {
    id?: number,
    title?: string | ReactNode,
    description?: string | ReactNode,
    titleAlignment?: `left` | `center` | `right`,
    message?: string | ReactNode,
    content?: string | ReactNode,
    width?: number | string,
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
    
    /** WithForm */
    useForm?: boolean,
    formProps?: FormProps,
    
    onConfirm?: (data?: dynamic, validateResult?: ValidationResult) => void,
    onCancel?: () => void,
    onShow?: () => void,
    onHide?: () => void,
} & LayerHandler
export interface DialogActionHandler {
    key?: string,
    label: string, 
    kind?: ButtonKind,
    type?: "button" | "reset" | "submit",
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