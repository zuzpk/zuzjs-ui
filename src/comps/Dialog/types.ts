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
    /** The title of the dialog */
    title?: string | ReactNode,
    /** The description of the dialog */
    description?: string | ReactNode,
    /** The alignment of the title */
    titleAlignment?: `left` | `center` | `right`,
    /** The message of the dialog */
    message?: string | ReactNode,
    /** The content of the dialog */
    content?: string | ReactNode,
    /** The width of the dialog */
    width?: number | string,
    /** The transition of the dialog */
    transition?: ValueOf<typeof TRANSITIONS>,
    /** The curve of the dialog */
    curve?: ValueOf<typeof TRANSITION_CURVES>,
    /** The speed of the dialog */
    speed?: number,
    /** The delay of the dialog */
    delay?: number,
    /** The type of the dialog */
    type?: ValueOf<typeof DIALOG>,
    /** The spinner of the dialog */
    spinner?: ValueOf<typeof SPINNER>,
    /** The loading message of the dialog */
    loadingMessage?: string,
    /** The actions of the dialog */
    action?: DialogActionHandler[],
    /** The position of the actions */
    actionPosition?: ValueOf<typeof DIALOG_ACTION_POSITION>,
    /** The variant of the dialog */
    variant?: ValueOf<typeof Variant>,
    
    /** WithForm */
    useForm?: boolean,
    formProps?: FormProps,

    /** Additional CSS classes to apply to the dialog */
    withClass?: string,
    /** If true, the dialog will not render a header */
    noHead?: boolean,
    
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