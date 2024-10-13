"use client"
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import With, { animationProps } from "./base";
import { SHEET, TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
import Cover, { CoverProps } from "./cover";
import { animationTransition, getAnimationTransition } from "../funs/css";
import { BaseProps } from "../types/interfaces";
import useComponentEditor from "../hooks/useCompEditor";
import ComponentEditor from "./editor";

export interface SheetProps {
    title?: string,
    message?: string | ReactNode,
    transition?: TRANSITIONS,
    curve?: TRANSITION_CURVES,
    speed?: Number,
    type?: SHEET,
}

export interface SheetActionHandler {
    label: string, 
    handler: () => void
}

export interface SheetHandler {
    showDialog: ( 
        title : string | ReactNode, 
        message : string | ReactNode, 
        action? : SheetActionHandler[], 
        onShow?: () => void 
    ) => void,
    show: ( message : string | ReactNode, duration?: number, type?: SHEET ) => void,
    hide: () => void,
}

let _sheetTimeout: NodeJS.Timeout | null = null
let _sheetWobbleTimeout: NodeJS.Timeout | null = null

const Sheet = forwardRef<SheetHandler, SheetProps & BaseProps>((props, ref) => {
    
    const { as, transition, curve, speed, editor, type, ...rest } = props;

    const _editor = useComponentEditor()

    const [ visible, setVisible ] = useState(false)
    const [ title, setTitle ] = useState<string | ReactNode>(``)
    const [ msg, setMsg ] = useState<string | ReactNode>(``)
    const [ action, setAction ] = useState<SheetActionHandler[] | null>(null)
    const [ _errorType, setErrorType ] = useState(type || SHEET.Default)
    const [ loading, setLoading ] = useState(false)

    const divRef = useRef<HTMLDivElement>(null);
    const lastTransform = useRef<string | null>(null)
    
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
                divRef.current!.classList.remove(`wobble`)
                setTimeout(() => divRef.current!.classList.add(`wobble`), 50)
                _sheetWobbleTimeout = setTimeout(() => {
                    divRef.current!.classList.remove(`wobble`)
                    _sheetWobbleTimeout = null
                }, 500)
            }

            setErrorType(SHEET.Dialog)
            setMsg(message);
            setTitle(title);
            if ( action) setAction(action);
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
                // if ( lastTransform ) divRef.current!.style.transform = _lastTransform
                lastTransform.current = divRef.current!.style.transform
                divRef.current!.style.transform = ``
                divRef.current!.classList.remove(`wobble`)
                setTimeout(() => {
                    divRef.current!.classList.add(`wobble`)
                    divRef.current!.style.transform = `${lastTransform.current} scale(.9)`.trim()
                }, 50)
                _sheetWobbleTimeout = setTimeout(() => {
                    divRef.current!.classList.remove(`wobble`)
                    divRef.current!.style.transform = lastTransform.current || ``
                    _sheetWobbleTimeout = null
                }, 500)
            }              
            
            _sheetTimeout = setTimeout(() => {
                setVisible(false)
                _sheetTimeout = null
                _sheetWobbleTimeout = null
            }, (duration || 4) * 1000)
            
            setErrorType(type || SHEET.Default)
            setMsg(message);
            setVisible(true);
        },
        hide(){
            setVisible(false)
        }
    }))
        
    const buildAnimation = () => {

        const base = {
            when: visible,
            duration: speed || 0.3,
            delay: 0.1,
        }

        if ( _errorType == SHEET.Dialog){

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
    }

    const sheetProps = useMemo(() => ({
        "sheet-radius": `label:Radius type:range value:auto min:0 max:50 unit:px`,
    }), [])
    const toastProps = useMemo(() => ({
        "sheet-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
        "sheet-font-size": `label:Font,Size type:range value:auto min:12 max:72 unit:px`,
    }), [])
    const dialogProps = useMemo(() => ({
        "sheet-bg": `label:Background type:color value:auto`,
        "@group-Head": {
            label: "Head",
            pops: {
                "sheet-title-opacity": `label:Opacity type:range value:auto min:0 max:1 step:0.1`,
                "sheet-head-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
            }
        },
        "@group-Body": {
            label: "Body",
            pops: {
                "sheet-body-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
            }
        },
        "@group-Footer": {
            label: "Footer",
            pops: {
                "sheet-footer": `label:Background type:color value:auto`,
                "sheet-footer-padding": `label:Padding type:range value:auto min:0 max:50 unit:px`,
                "@group-Action": {
                    label: "Footer Action",
                    pops: {
                        "sheet-action": `label:Background type:color value:auto`,
                        "sheet-action-color": `label:Text,Color type:color value:auto`,
                        "sheet-action-hover": `label:Hover,Color type:color value:auto`,
                        "sheet-action-radius": `label:Radius type:range value:auto min:0 max:50 unit:px`,
                    }
                }
            }
        },
        "@group-Close": {
            label: "Close Button",
            pops: {
                "sheet-closer-font-size": `label:Size type:range value:auto min:8 max:72 step:2 unit:px`,
                "sheet-closer-color": `label:Color type:color value:auto`,
                "sheet-closer-opacity": `label:Opacity type:range value:auto min:0 max:1 step:0.1`,
                "sheet-closer-hover-opacity": `label:Hover,Opacity type:range value:auto min:0 max:1 step:0.1`,
            }
        }
    }), [])

    useEffect(() => {
        
    }, [])

    if ( _errorType == SHEET.Dialog ){
        return <>
            <With 
                aria-hidden={!visible} 
                className={`zuz-overlay fixed fill`} 
                animate={{
                    transition: TRANSITIONS.FadeIn,
                    when: visible,
                    duration: 0.1,
                }} />

            <With 
            animate={buildAnimation()}
            as={as} 
            className={`zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim()}
            {...rest} 
            ref={divRef}>
                <Cover {...({ when: loading }) as CoverProps} />
                <With className={`sheet-head flex aic rel`}>
                    <With className={`sheet-${title ? `title` : `dot`}`}>{title || ``}</With>
                    <With tag={`button`} onClick={(e: MouseEvent) => setVisible(false)} className={`sheet-closer abs`}>&times;</With>
                </With>
                <With className={`sheet-body flex aic rel`}>
                    {msg}
                </With>
                {action && <With className={`sheet-footer flex aic rel`}>
                    {action.map((a: SheetActionHandler, i: number) => <With onClick={a.handler} tag={`button`} as={`sheet-action-btn`}>{a.label}</With>)}
                </With>}
            </With>
            {props.editor && visible && <ComponentEditor 
            element={`.zuz-sheet`}
            title={`Sheet`} 
            attrs={{
                ...sheetProps,
                ...(_errorType == SHEET.Dialog ? dialogProps : toastProps)
            }} />}
        </>
    } 

    return <With 
    animate={buildAnimation()}
    as={as} 
    className={`zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim()}
    {...rest} 
    ref={divRef}>
        {visible ? msg : null}
    </With>


});

export default Sheet