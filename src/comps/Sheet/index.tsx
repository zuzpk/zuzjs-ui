"use client"
import { forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { SHEET, SHEET_ACTION_POSITION, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import { useBase } from "../../hooks";
import { uuid } from "../../funs";
import { animationTransition } from "../../funs/css";
import Button, { ButtonProps } from "../Button";
import SVGIcons from "../svgicons";
import Cover, { CoverProps } from "../Cover";
import { ZuzProps } from "../../types";
import Overlay, { OverlayProps } from "../Overlay";
import { animationProps } from "../../types/interfaces";

export type SheetProps = ZuzProps & {
    title?: string,
    message?: string | ReactNode,
    transition?: TRANSITIONS,
    curve?: TRANSITION_CURVES,
    speed?: Number,
    type?: SHEET,
    actionPosition?: SHEET_ACTION_POSITION,
}

export interface SheetActionHandler {
    key?: string,
    label: string, 
    handler?: () => void,
    onClick?: () => void,
}

export interface SheetHandler {
    showDialog: ( 
        title : string | ReactNode, 
        message : string | ReactNode, 
        action? : SheetActionHandler[], 
        onShow?: () => void 
    ) => void,
    dialog: ( 
        title : string | ReactNode, 
        message : string | ReactNode, 
        action? : SheetActionHandler[], 
        onShow?: () => void 
    ) => void,
    show: ( message : string | ReactNode, duration?: number, type?: SHEET ) => void,
    success: ( message : string | ReactNode, duration?: number ) => void,
    error: ( message : string | ReactNode, duration?: number ) => void,
    warn: ( message : string | ReactNode, duration?: number ) => void,
    hide: () => void,
}

let _sheetTimeout: NodeJS.Timeout | null = null
let _sheetWobbleTimeout: NodeJS.Timeout | null = null

const Sheet = forwardRef<SheetHandler, SheetProps>((props, ref) => {

    const { title : _title, message, transition, curve, speed, type, actionPosition, ...pops } = props

    const {
        className,
        style,
        rest
    } = useBase(pops as BoxProps)

    const [ title, setTitle ] = useState<string | ReactNode>(``)
    const [ msg, setMsg ] = useState<string | ReactNode>(``)
    const [ action, setAction ] = useState<SheetActionHandler[] | null>(null)
    const [ sheetType, setSheetType ] = useState<SHEET>(type || SHEET.Default);
    const sheetID = useMemo(() => uuid(), [])
    const [ visible, setVisible ] = useState(false)
    const innerRef = useRef<HTMLDivElement>(null);
    const lastTransform = useRef<string | null>(null)
    const [ loading, setLoading ] = useState(false)
    const [ render, setRender ] = useState(true)
    const _render = useRef<NodeJS.Timeout>(null)

    useImperativeHandle(ref, () => ({
        setLoading(mode: boolean){
            setLoading(mode)
        },
        showDialog( 
            title: string | ReactNode, 
            message: string | ReactNode, 
            action?: SheetActionHandler[],
            onShow?: () => void ){

            if ( _sheetTimeout ){
                clearTimeout(_sheetTimeout);
                if ( _sheetWobbleTimeout ){
                    clearTimeout(_sheetWobbleTimeout);
                }
                innerRef.current!.classList.remove(`--wobble`)
                setTimeout(() => innerRef.current!.classList.add(`--wobble`), 50)
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current!.classList.remove(`--wobble`)
                    _sheetWobbleTimeout = null
                }, 500)
            }

            setSheetType(SHEET.Dialog)
            setMsg(message);
            setTitle(title);
            if ( action ) setAction(action.reduce((ar, b) => {
                ar.push({
                    ...b,
                    key: b.key || uuid()
                })
                return ar
            }, [] as SheetActionHandler[]));
            setVisible(true);

            setTimeout(() => onShow ? onShow() : () => {}, 1000)
        },
        dialog( 
            title: string | ReactNode, 
            message: string | ReactNode, 
            action?: SheetActionHandler[],
            onShow?: () => void ){

            if ( _sheetTimeout ){
                clearTimeout(_sheetTimeout);
                if ( _sheetWobbleTimeout ){
                    clearTimeout(_sheetWobbleTimeout);
                }
                innerRef.current!.classList.remove(`--wobble`)
                setTimeout(() => innerRef.current!.classList.add(`--wobble`), 50)
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current!.classList.remove(`--wobble`)
                    _sheetWobbleTimeout = null
                }, 500)
            }

            setSheetType(SHEET.Dialog)
            setMsg(message);
            setTitle(title);
            if ( action ) setAction(action.reduce((ar, b) => {
                ar.push({
                    ...b,
                    key: b.key || uuid()
                })
                return ar
            }, [] as SheetActionHandler[]));
            setVisible(true);

            setTimeout(() => onShow ? onShow() : () => {}, 1000)
        },
        error( message: string | ReactNode, duration?: number){
            this.show( message, duration, SHEET.Error)  
        },
        warn( message: string | ReactNode, duration?: number){
            this.show( message, duration, SHEET.Warn)  
        },
        success( message: string | ReactNode, duration?: number){
            this.show( message, duration, SHEET.Success)  
        },
        show( message: string | ReactNode, duration?: number, type?: SHEET ){
            
            if ( _sheetTimeout ){
                clearTimeout(_sheetTimeout);
                if ( _sheetWobbleTimeout ){
                    clearTimeout(_sheetWobbleTimeout);
                }
                // if ( lastTransform ) innerRef.current!.style.transform = _lastTransform
                lastTransform.current = innerRef.current!.style.transform
                innerRef.current!.style.transform = ``
                innerRef.current!.classList.remove(`--wobble`)
                setTimeout(() => {
                    innerRef.current!.classList.add(`--wobble`)
                    innerRef.current!.style.transform = `${lastTransform.current} scale(.9)`.trim()
                }, 50)
                _sheetWobbleTimeout = setTimeout(() => {
                    innerRef.current!.classList.remove(`--wobble`)
                    innerRef.current!.style.transform = lastTransform.current || ``
                    _sheetWobbleTimeout = null
                }, 500)
            }              
            
            _sheetTimeout = setTimeout(() => {
                setVisible(false)
                _sheetTimeout = null
                _sheetWobbleTimeout = null
            }, (duration || 4) * 1000)
            
            setSheetType(type || SHEET.Default)
            setMsg(message);
            setVisible(true);
        },
        hide(){
            setVisible(false)
        }
    }))

    const buildAnimation = useCallback(() => {

        const base = {
            when: visible,
            duration: speed || 0.3,
            delay: 0.1,
        }

        if ( sheetType == SHEET.Dialog){

            if ( transition ){

                const { from, to } = animationTransition(transition)

                return{
                    from: { ...from, x: `-50%`, y: `-50%` },
                    to: { ...to, x: `-50%`, y: `-50%` },
                    curve: curve || TRANSITION_CURVES.EaseInOut,
                    ...base
                }    
            }

            return{
                from: { scale: 0, x: `-50%`, y: `-50%`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: `-50%`, opacity: 1 },
                curve: TRANSITION_CURVES.Spring,
                ...base
            }
            
        }
        else {
            return {
                from: { scale: 0, x: `-50%`, y: `-10vh`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: 0, opacity: 1 },
                curve: TRANSITION_CURVES.Spring,
                ...base
            }
        }
    }, [visible])

    useEffect(() => {
        if ( _render.current ) clearTimeout(_render.current)
        if ( !visible ){
            _render.current = setTimeout(() => setRender(false), 1000)
        }
        else{
            setRender(true)
        }
    }, [visible])

    if ( sheetType == SHEET.Dialog ){
        return <>

            <Overlay when={visible} />

            <Box
                className={`--sheet --sheet-${sheetType.toLowerCase()} ${className} fixed`.trim()}
                style={style}
                animate={buildAnimation() as animationProps}
                {...rest as BoxProps}
                ref={innerRef}>

                <Cover when={loading} />
                
                {/* Header */}
                <Box className={`--head flex aic rel`}>
                    <Box className={`--${title ? `title` : `dot`} flex aic rel`}>{title || ``}</Box>
                    <Button 
                        onClick={(e) => setVisible(false)}
                        className={`--closer abs`}>&times;</Button>
                </Box>
                {/* Body */}
                <Box className={`--body flex aic rel ${action ? `` : `--no-action`}`.trim()}>
                    {render ? msg : null}
                </Box>
                {/* Footer */}
                { action && <Box className={`--footer flex aic rel ${actionPosition ? actionPosition == SHEET_ACTION_POSITION.Center ? `jcc` : `` : `jce`}`.trim()}>
                    {action.map((a: SheetActionHandler, i: number) => <Button 
                        key={`sheet-${sheetID}-action-${a.key}`}  
                        onClick={(e) => a.handler ? a.handler() : a.onClick ? a.onClick() : console.log(`onClick Handler missing`)}
                        className={`--action`}>{a.label}</Button>)}
                </Box> }

            </Box>

        </>
    } 

    return <Box
        className={`--sheet --sheet-${sheetType.toLowerCase()} ${className} abs`.trim()}
        style={style}
        {...rest as BoxProps}
        animate={buildAnimation() as animationProps}
        ref={innerRef}>
        {visible ? msg : null}
    </Box>
})

export default Sheet