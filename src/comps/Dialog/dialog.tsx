import { ReactNode, Ref, useEffect, useMemo, useRef, useState } from "react"
import { DialogActionHandler, DialogHandler, DialogProps } from "./types"
import Overlay from "../Overlay"
import { uuid } from "@zuzjs/core"
import useBase from "../../hooks/useBase"
import DialogHead from "./head"
import DialogBody from "./body"
import DialogFooter from "./footer"
import Box from "../Box"
import { DIALOG, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums"
import { useFx } from "../../hooks"
import { BoxProps, ValueOf } from "../../types"
import Cover from "../Cover"
import { useTheme } from "../../hooks/useColorScheme"
import { SPINNER } from "../Spinner/types"

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
        onClose,
        onShow,
        onHide,
        ...pops
    } = props

    const dialogID = useMemo(() => uuid(12), [])
    const [ title, setTitle ] = useState<string | ReactNode>(_title || ``)
    const [ msg, setMsg ] = useState<string | ReactNode>(message || ``)
    const [ sheetType, setSheetType ] = useState<ValueOf<typeof DIALOG>>(type || DIALOG.Dialog);
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

    const sheetAnimation = useFx({
        when: visible,
        duration: speed || themeDialog?.speed || 0.3,
        delay: themeDialog?.delay || 0.1,
        transition: transition || themeDialog?.transition || TRANSITIONS.SlideInBottom,
        curve: curve || themeDialog?.curve || TRANSITION_CURVES.EaseInOut
    })

    useEffect(() => {
        setSheetType(DIALOG.Dialog)
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

        setTimeout(() => onShow ? onShow() : () => {}, 1000)
    }, [])

    return <>
        <Overlay when={visible} />
        <Box
            as={`--dialog --${(type ?? DIALOG.Default).toLowerCase()} ${visible ? `--visible` : ``} ${className} fixed abc`.trim()}
            style={sheetAnimation.style}
            {...rest as BoxProps}
            ref={innerRef}>
                
            <Cover when={loading} spinner={spinner || themeDialog?.spinner || themeSpinner?.type || SPINNER.Simple} message={loadingMessage || themeDialog?.loadingMessage} />

            <DialogHead
                title={title} 
                onClose={() => {
                    setVisible(false)
                    onClose(id!)
                }} />

            <DialogBody
                message={msg}
                render={render}
                action={action} />

            {action && <DialogFooter
                variant={_variant}
                action={action} 
                dialogID={dialogID} 
                actionPosition={actionPosition} />}

        </Box>
    </>

}

Dialog.displayName = `Zuz.Dialog`

export default Dialog