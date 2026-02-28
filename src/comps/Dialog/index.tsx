import { uuid } from "@zuzjs/core"
import { KeyCode, useShortcuts } from "@zuzjs/hooks"
import { ReactNode, Ref, useEffect, useMemo, useRef, useState } from "react"
import { useFx } from "../../hooks"
import useBase from "../../hooks/useBase"
import { useTheme } from "../../hooks/useColorScheme"
import { BoxProps, ValueOf } from "../../types"
import { DIALOG, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums"
import Box from "../Box"
import Cover from "../Cover"
import { layerManager } from "../layer_manager"
import Overlay from "../Overlay"
import { SPINNER } from "../Spinner/types"
import DialogBody from "./body"
import DialogFooter from "./footer"
import DialogHead from "./head"
import { DialogActionHandler, DialogHandler, DialogProps } from "./types"

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
        message,
        transition,
        curve,
        speed,
        type, 
        action: _action,
        actionPosition,
        spinner,
        loadingMessage,
        variant,
        inBackground,
        forceClose,
        forceLoading,
        onClose,
        onShow,
        onHide,
        ...pops
    } = props

    const dialogID = useMemo(() => uuid(12), [])
    const [ title, setTitle ] = useState<string | ReactNode>(_title || ``)
    const [ msg, setMsg ] = useState<string | ReactNode>(message || ``)
    const [ dialogType, setDialogType ] = useState<ValueOf<typeof DIALOG>>(type || DIALOG.Dialog);
    const [ visible, setVisible ] = useState(false)
    const [ render, setRender ] = useState(true)
    const [ action, setAction ] = useState<DialogActionHandler[] | null>(_action || null)
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
        setMsg(message);
        setTitle(title);
        if ( action ) setAction(action.reduce((ar, b) => {
            ar.push({
                ...b,
                key: b.key || uuid(12)
            })
            return ar
        }, [] as DialogActionHandler[]));
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

    return <>
        <Overlay 
            style={{ zIndex: baseZIndex }}
            when={visible} />
        <Box
            as={`--dialog --${(type ?? DIALOG.Default).toLowerCase()} ${visible ? `--visible` : ``} ${className} fixed abc`.trim()}
            style={{
                ...dialogAnimation.style,
                zIndex: baseZIndex + 1,
                pointerEvents: inBackground == true ? 'none' : 'auto',
                ...(inBackground == true ? {
                    scale: `0.92`,
                    filter: `blur(2px)`
                } : {})
            }}
            {...rest as BoxProps}
            ref={innerRef}>
                

            <DialogHead
                title={title} 
                onClose={closeDialog} />

            <DialogBody
                message={msg}
                render={render}
                action={action} />

            {action && action.length > 0 && <DialogFooter
                variant={_variant}
                action={action} 
                dialogID={dialogID} 
                actionPosition={actionPosition} />}

            <Cover when={loading} spinner={spinner || themeDialog?.spinner || themeSpinner?.type || SPINNER.Simple} message={loadingMessage || themeDialog?.loadingMessage} />

        </Box>
    </>

}

Dialog.displayName = `Zuz.Dialog`

export default Dialog