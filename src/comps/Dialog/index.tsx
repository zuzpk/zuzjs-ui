import { dynamic, uuid } from "@zuzjs/core"
import { KeyCode, useShortcuts } from "@zuzjs/hooks"
import { ReactNode, Ref, useEffect, useMemo, useRef, useState } from "react"
import { useFx } from "../../hooks"
import useBase from "../../hooks/useBase"
import { useTheme } from "../../hooks/useColorScheme"
import { BoxProps, ValueOf } from "../../types"
import { DIALOG, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums"
import Box from "../Box"
import Cover from "../Cover"
import Form from "../Form"
import { ValidationResult } from "../Form/types"
import { layerManager } from "../layer_manager"
import Overlay from "../Overlay"
import { SPINNER } from "../Spinner/types"
import DialogBody from "./body"
import DialogFooter from "./footer"
import DialogHead from "./head"
import { DialogActionHandler, DialogHandler, DialogProps } from "./types"

/**
 * Dialog component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Dialog title="Confirm" message="Are you sure?" action={[{ label: "OK" }, { label: "Cancel" }]} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Dialog title="Save Changes?" message="Your edits will be lost" type="warning" action={[{ label: "Save", handler: () => {} }, { label: "Discard" }]} onShow={() => console.log("shown")} />
 * ```
 * @param title - Title text or element
 * @param message - Message text or element
 * @param type - Component or input type
 * @param action - action prop
 * @param onShow - Callback function triggered when showing
 */
const Dialog = ({
    ref,
    ...props
} : DialogProps & {
    index: number,
    onClose: (id: number) => void,
    ref?: Ref<DialogHandler>
}) => {

    const { 
        index, 
        id, 
        title: _title,
        description: _description,
        titleAlignment,
        message,
        content,
        transition,
        curve,
        speed,
        type, 
        width,
        action: _action,
        actionPosition,
        spinner,
        loadingMessage,
        variant,
        inBackground,
        forceClose,
        forceLoading,
        useForm,
        formProps,
        noHead,
        withClass = ``,
        onConfirm,
        onCancel,
        onClose,
        onShow,
        onHide,
        ...pops
    } = props

    const dialogID = useMemo(() => uuid(12), [])
    const [ title, setTitle ] = useState<string | ReactNode>(_title || ``)
    const [ description, setDescription ] = useState<string | ReactNode>(_description || ``)
    const [ msg, setMsg ] = useState<string | ReactNode>(content || message || ``)
    const [ dialogType, setDialogType ] = useState<ValueOf<typeof DIALOG>>(type || DIALOG.Dialog);
    const [ visible, setVisible ] = useState(false)
    const [ render, setRender ] = useState(true)
    const [ action, setAction ] = useState<DialogActionHandler[] | null>(() => {
        if (!_action) return null;
        return _action.map((a) => ({
            ...a,
            key: a.key || uuid(12)
        }));
    })
    const [ loading, setLoading ] = useState(false)
    const { 
        variant: themeVariant,
        spinner: themeSpinner,
        dialog: themeDialog,
    } = useTheme(true)!
    const _variant = variant || themeDialog?.variant || themeVariant || Variant.Small
        
    const {
        style,
        className,
        rest
    } = useBase(pops)

    const innerRef = useRef<HTMLDivElement>(null);

    const dialogAnimation = useFx({
        when: visible,
        duration: speed || themeDialog?.speed || 0.3,
        delay: themeDialog?.delay || 0.1,
        transition: transition || themeDialog?.transition || TRANSITIONS.SlideInBottom,
        curve: curve || themeDialog?.curve || TRANSITION_CURVES.EaseInOut,
        watch: [`scale`, `filter`, `transform`]
    })

    const closeDialog = () => {
        setVisible(false)
        onClose(id!)
    }


    const shortcutsConfig = useMemo(() => [
        { 
            keys: [KeyCode.Escape], 
            callback: () => {
                if (layerManager.isTop(closeDialog)) closeDialog();
            }
        }
    ], [visible]);

    useShortcuts(shortcutsConfig)
    
    useEffect(() => {
        setDialogType(DIALOG.Dialog)
        setMsg(content || message);
        setTitle(title);
        setDescription(description);
        setVisible(true);

        setTimeout(() => onShow ? onShow() : () => {}, 500)
    }, [])

    useEffect(() => {
        if (forceClose) {
            closeDialog();
        }
    }, [forceClose]);

    useEffect(() => {
        if ( undefined != forceLoading ) setLoading(forceLoading)
    }, [forceLoading]);

    useEffect(() => {
        if ( visible ){
            layerManager.push(closeDialog)
        }else{
            layerManager.pop(closeDialog)
        }
        return () => layerManager.pop(closeDialog)
    }, [visible])

    const baseZIndex = useMemo(() => 10000 + (index * 10), [index]);

    const _dialog = <Box
        as={`--dialog --${(type ?? DIALOG.Default).toLowerCase()} ${visible ? `--visible` : ``} ${className} ${withClass} fixed abc`.trim()}
        style={{
            ...dialogAnimation.style,
            zIndex: baseZIndex + 1,
            pointerEvents: inBackground == true ? 'none' : 'auto',
            width: width || `auto`,
            ...(inBackground == true ? {
                scale: `0.92`,
                filter: `blur(2px)`
            } : {})
        }}
        {...rest as BoxProps}
        ref={innerRef}>
            

        {!noHead && <DialogHead
            title={title} 
            description={_description}
            titlePosition={titleAlignment || themeDialog?.titleAlignment || `center`}
            onClose={closeDialog} />}

        <DialogBody
            message={msg}
            render={render}
            action={action} />

        {action && action.length > 0 && <DialogFooter
            variant={_variant}
            action={action} 
            dialogID={dialogID} 
            useForm={useForm}
            actionPosition={actionPosition} />}

        <Cover when={loading} spinner={spinner || themeDialog?.spinner || themeSpinner?.type || SPINNER.Simple} message={loadingMessage || themeDialog?.loadingMessage} />

    </Box>

    return <>
        <Overlay 
            style={{ zIndex: baseZIndex }}
            when={visible} />
        
        { useForm ? <Form 
            onSubmit={((data: dynamic, result: ValidationResult) => {
                onConfirm?.(data, result);
            }) as any}
            {...formProps}>{_dialog}</Form> : _dialog}
    </>

}

Dialog.displayName = `Zuz.Dialog`

export default Dialog