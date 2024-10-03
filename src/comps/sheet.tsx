"use client"
import { forwardRef, ReactNode, useEffect, useImperativeHandle, useRef, useState } from "react";
import With, { animationProps } from "./base";
import { SHEET } from "../types/enums";
import Cover, { CoverProps } from "./cover";

export interface SheetProps {
    as?: string,
    animate?: animationProps,
    title?: string,
    message?: string | ReactNode,
}

export interface SheetActionHandler {
    label: string, 
    handler: () => void
}

export interface SheetHandler {
    showDialog: ( 
        title : string | ReactNode, 
        message : string | ReactNode, 
        action? : SheetActionHandler, 
        onShow?: () => void 
    ) => void,
    show: ( message : string | ReactNode, duration?: number, type?: SHEET ) => void,
    hide: () => void,
}

let _sheetTimeout: NodeJS.Timeout | null = null
let _sheetWobbleTimeout: NodeJS.Timeout | null = null

const Sheet = forwardRef<SheetHandler, SheetProps>((props, ref) => {
    
    const { as, ...rest } = props;

    const [ visible, setVisible ] = useState(false)
    const [ title, setTitle ] = useState<string | ReactNode>(``)
    const [ msg, setMsg ] = useState<string | ReactNode>(``)
    const [ action, setAction ] = useState<SheetActionHandler | null>(null)
    const [ _errorType, setErrorType ] = useState(SHEET.Default)
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
            action?: SheetActionHandler,
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
        
    useEffect(() => {
        
    }, [])

    return <>{_errorType == SHEET.Dialog && <With className={`zuz-sheet-overlay fixed fill`} animate={{
        from: { y: `-100vh`, opacity: 0 },
        to: { y: 0, opacity: 1 },
        when: visible,
        duration: 0.1,
    }} />}
        <With 
            animate={_errorType == SHEET.Dialog ? {
                from: { scale: 0, x: `-50%`, y: `-50%`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: `-50%`, opacity: 1 },
                when: visible,
                duration: 0.3,
                delay: 0.1,
                curve: `spring`
            } : {
                from: { scale: 0, x: `-50%`, y: `-10vh`, opacity: 0 },
                to: { scale: 1, x: `-50%`, y: 0, opacity: 1 },
                when: visible,
                duration: 0.3,
                delay: 0.1,
                curve: `spring`
            }}
            as={as} 
            className={`zuz-sheet toast-${_errorType.toLowerCase()} fixed`.trim()}
            {...rest} 
            ref={divRef}>
            {_errorType == SHEET.Dialog && <Cover {...({
                when: loading,
            }) as CoverProps} />}
            {_errorType == SHEET.Dialog && <With className={`zuz-sheet-head flex aic rel`}>
                <With className={`zuz-sheet-${title ? `title` : `dot`}`}>{title || ``}</With>
                <With tag={`button`} onClick={(e: MouseEvent) => setVisible(false)} className={`zuz-sheet-closer abs`}>&times;</With>
            </With>}
            {visible && msg == `` ? `Lorem ipsum dolor sit amet, consectetur adipiscing...` : msg}
        </With>    
    </>
});

// import { forwardRef, ReactNode, Ref, useEffect, useImperativeHandle, useRef, useState } from "react";
// import { css, cleanProps } from "../funs";
// import { UIProps } from "../types/interfaces";
// import { SHEET } from "../types/enums";

// export interface SheetProps extends UIProps<HTMLDivElement> {
//     title?: string,
//     message?: string | ReactNode
// }

// export interface SheetHandler {
//     show: ( message : string, duration?: number, type?: SHEET ) => void,
//     hide: () => void
// }

// let _sheetTimeout: NodeJS.Timeout | null = null
// let _sheetWobbleTimeout: NodeJS.Timeout | null = null

// const Sheet = forwardRef<SheetHandler, SheetProps>(( props :  SheetProps, ref ) => {

//     const { as, title } = props
//     const { cx } = css.Build(as)
//     const [ visible, setVisible ] = useState(false)
//     const [ msg, setMsg ] = useState(``)
//     const [ _errorType, setErrorType ] = useState(SHEET.Default)

//     const divRef = useRef<HTMLDivElement>(null);
    
//     useImperativeHandle(ref, () => ({
//         show( message: string, duration?: number, type?: SHEET ){
//             if ( _sheetTimeout ){
//                 clearTimeout(_sheetTimeout);
//                 if ( _sheetWobbleTimeout ){
//                     clearTimeout(_sheetWobbleTimeout);
//                 }
//                 divRef.current!.classList.remove(`wobble`)
//                 setTimeout(() => divRef.current!.classList.add(`wobble`), 50)
//                 _sheetWobbleTimeout = setTimeout(() => {
//                     divRef.current!.classList.remove(`wobble`)
//                     _sheetWobbleTimeout = null
//                 }, 500)
//             }                      
//             _sheetTimeout = setTimeout(() => {
//                 setVisible(false)
//                 _sheetTimeout = null
//                 _sheetWobbleTimeout = null
//             }, (duration || 4) * 1000)
//             setErrorType(type || SHEET.Default)
//             setMsg(message);
//             setVisible(true);
//         },
//         hide(){
//             setVisible(false)
//         }
//     }))
        
//     useEffect(() => {
        
//     }, [])

//     return <div 
//         ref={divRef}
//         className={[`zuz-sheet toast-${_errorType.toLowerCase()} zuz-toast${visible ? ` is-visible` : ``} fixed`, ...cx].join(` `).trim()}
//         {...(cleanProps(props) as UIProps<HTMLDivElement>)}>
//             {msg == `` ? `Lorem ipsum dolor sit amet, consectetur adipiscing...` : msg}
//         </div>

// })

export default Sheet