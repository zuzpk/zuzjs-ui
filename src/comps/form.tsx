"use client"

import { ComponentPropsWithoutRef, forwardRef, ReactNode, RefObject, useEffect, useImperativeHandle, useRef, useState, useTransition } from "react";
import With, { animationProps } from "./base";
import Spinner, { SpinnerProps } from "./spinner";
import { hexToRgba, isEmail, withPost } from "../funs";
import Sheet, { SheetHandler } from "./sheet";
import { FORMVALIDATION, SHEET, SPINNER } from "../types/enums";
import { dynamicObject, FormInputs } from "../types";
import Cover, { CoverProps } from "./cover";

// const { as, ref, errors, at, cover, spinner, onSubmit, onSuccess, onError, children } = props
export interface FormProps { 
    as?: string, 
    animate?: animationProps,
    action?:  string,
    errors?: string[],
    spinner?: SpinnerProps,
    withData?: dynamicObject,
    onSubmit?: (data: FormData | dynamicObject) => void,
    onSuccess?: (data: dynamicObject) => void, // Update the type of onSuccess prop to be a function type or undefined
    onError?: (error: any) => void, // Update the type of onError prop to be a function type or undefined
    cover?: {
        color?: string,
        message?: string
    }
}

export interface FormHandler {
    setLoading: ( mode: boolean ) => void,
}

const Form = forwardRef<FormHandler, FormProps & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
    
    const { as, spinner, action, errors, cover, children, withData, onSuccess, onSubmit, onError, ...rest } = props;

    const [ loading, setLoading ] = useState(false)
    const [ isLoading, startTransition ] = useTransition()
    const [ sheetType, setSheetType ] = useState(SHEET.Default)
    
    const sheet = useRef<SheetHandler>(null)
    const _ref = useRef<HTMLDivElement>(null);

    const _nodes = ( query: string ) => _ref.current!.querySelectorAll(query)

    const _validate = ( el: any ) : boolean => {

        if ( el.required ){
            // console.log(el.type, el.checked)
            if ( el.type == `checkbox` && el.checked == false ){
                return false
            }
            if ( el.value == `` )
                return false     
        }

        if ( el.getAttribute(`with`) ){

            let _with = el.getAttribute(`with`)
            if ( _with.includes(`@`) ){
                _with = _with.split(`@`)[0]
                if ( _with == `match` ){
                    _with = FORMVALIDATION.MatchField
                }
            }

            switch ( _with.toUpperCase() ){
                case FORMVALIDATION.Email:
                    return isEmail(el.value)
                    break;
                case FORMVALIDATION.Uri:
                    console.log(`Add FORMVALIDATION.Uri`)
                    return false
                    break;
                case FORMVALIDATION.Password:
                    console.log(`Add FORMVALIDATION.Password`)
                    return false
                    break;
                case FORMVALIDATION.MatchField:
                    const [ __, field ] = el.getAttribute(`with`).split(`@`)
                    const _el = document.querySelector<FormInputs>(`[name=${field.trim()}]`)
                    if ( !_el ) return false
                    console.log(`matching`, _el.name, _el.value, el.name, el.value)                    
                    if ( _el && _el.value != el.value ){
                        return false
                    }
                    break;
                default:
                    return true
            }
        }
        
        return true;
    }

    const _buildFormData = (  ) : {
        error: boolean,
        errorMsg: string,
        data: FormData | dynamicObject,
        payload: FormData | dynamicObject,
    } => {

        const data : dynamicObject = {}
        const payload : dynamicObject = {}
        let _error: HTMLElement | null = null
        let _errorMsg: HTMLElement | string | null = null

        Array.from(_nodes(`[name]`))
            .forEach((el : any) => {

                let valid = true
                if ( el.required || el.with )
                    valid = _validate(el)

                
                data[el.name] = {
                    valid: valid,
                    value: el.value
                }

                payload[el.name] = el.value

                if ( !valid ){
                    if ( _error == null && errors ){
                        _error = el
                        _errorMsg = errors[el.name]
                    }
                    el.classList.add(`input-with-error`)
                }else
                    el.classList.remove(`input-with-error`)            
                
            })

        if ( _error )
            (_error as HTMLElement).focus()

        return {
            error: _error != null,
            errorMsg: _errorMsg || `Fix errors to continue...`,
            data, payload
        }
            
    }

    const _onSubmit = ( ) => {
        
        const { error, errorMsg, payload } = _buildFormData()

        if ( error ){
            sheet.current!.show(errorMsg, 4, SHEET.Error)
        }
        else if ( action ){
            
            /**
             * We have action so 
             * submit to rest api manually
             */
            startTransition( async () => {
                
                setLoading(true)
                sheet.current!.hide()
                
                withPost(action, { ...payload, ...(withData || {}) })
                .then( _resp  => {
                    const resp = _resp as dynamicObject
                    setLoading(false)
                    if ( onSuccess ) 
                        onSuccess(resp)
                    else
                        sheet.current!.hide()
                        sheet.current!.show(resp.message || `Redirecting..`, 4, SHEET.Success)
                    
                })
                .catch(err => {

                    setLoading(false)

                    if( onError ) 
                        onError(err)
                    else
                        sheet.current!.show(err.message || `We cannot process your request at this time.`, 4, SHEET.Error)

                })

            })

        }

        else {
            onSubmit && onSubmit(payload)
        }

    }

    const _init = () => {
        const _submit = _nodes(`[type=submit]`)
        if ( !_submit || _submit.length == 0 ) {
            console.error(`You should add at least 1 button with type=\`SUBMIT\``)
        }
        else {
            _submit.forEach(el => {
                (el as HTMLButtonElement).addEventListener(`click`, _onSubmit)
            })
        }
    }

    useImperativeHandle(ref, () => ({
        setLoading(mod : boolean){
            setLoading(mod)
        },
        showError(errorMsg : string | ReactNode ){
            sheet.current!.show(errorMsg, 4, SHEET.Error)
        }
    }))
    
    useEffect(_init, [])

    return <With 
        as={as} 
        className={`rel`}
        ref={_ref} 
        propsToRemove={[`withData`, `action`, `onSubmit`, `onSuccess`, `onError`]}
        {...rest} 
    >
        {<Sheet ref={sheet} />}
        
        { loading && <Cover message={cover ? cover.message || undefined : `working`} {...{ spinner, color: cover ? `color` in cover ? cover.color : `#ffffff` : `#ffffff` } as CoverProps } /> }

        {children}

    </With>

});


// import { RefObject, useEffect, useRef, useState } from "react";
// import { css, cleanProps, isEmail } from "../funs";
// import { dynamicObject, FormInputs } from "../types";
// import { UIProps } from "../types/interfaces";
// import Cover, { CoverProps } from "./cover";
// import { SpinnerProps } from "./spinner";
// import { FORMVALIDATION, SHEET } from "../types/enums";
// import Sheet, { SheetHandler, SheetProps } from "./sheet";

// const Form = ( props : UIProps<HTMLDivElement> ) => {

//     const { as, ref, errors, at, cover, spinner, onSubmit, onSuccess, onError, children } = props
//     const { cx } = css.Build(as)

//     const [ loading, setLoading ] = useState(false)
//     const [ sheetType, setSheetType ] = useState(SHEET.Default)
    
//     const sheet = useRef<SheetHandler>(null)
    

//     const _ref = useRef(ref || null) 
    
//     const _nodes = ( query: string ) => (_ref as unknown as RefObject<HTMLDivElement>).current.querySelectorAll(query)

//     const _init = () => {
//         const _submit = _nodes(`[type=submit]`)
//         if ( !_submit || _submit.length == 0 ) {
//             console.error(`You should add at least 1 button with type=\`SUBMIT\``)
//         }
//         else {
//             _submit.forEach(el => {
//                 (el as HTMLButtonElement).addEventListener(`click`, _onSubmit)
//             })
//         }
//     }

//     const _validate = ( el: any ) : boolean => {

//         if ( el.required ){
//             if ( el.type == `checkbox` && el.checked == false ){
//                 return false
//             }
//             else if ( el.value == `` )
//                 return false     
//         }

//         if ( el.getAttribute(`with`) ){

//             let _with = el.getAttribute(`with`)
//             if ( _with.includes(`@`) ){
//                 _with = _with.split(`@`)[0]
//                 if ( _with == `match` ){
//                     _with = FORMVALIDATION.MatchField
//                 }
//             }

            

//             switch ( _with.toUpperCase() ){
//                 case FORMVALIDATION.Email:
//                     return isEmail(el.value)
//                     break;
//                 case FORMVALIDATION.Uri:
//                     console.log(`Add FORMVALIDATION.Uri`)
//                     return false
//                     break;
//                 case FORMVALIDATION.Password:
//                     console.log(`Add FORMVALIDATION.Password`)
//                     return false
//                     break;
//                 case FORMVALIDATION.MatchField:
//                     const [ __, field ] = el.getAttribute(`with`).split(`@`)
//                     const _el = document.querySelector<FormInputs>(`[name=${field.trim()}]`)
//                     if ( !_el ) return false
//                     console.log(`matching`, _el.name, _el.value, el.name, el.value)                    
//                     if ( _el && _el.value != el.value ){
//                         return false
//                     }
//                     break;
//                 default:
//                     return true
//             }
//         }
        
//         return true;
//     }

//     const _buildFormData = (  ) : {
//         error: boolean,
//         errorMsg: string,
//         data: FormData | dynamicObject
//     } => {

//         const data : dynamicObject = {}
//         let _error: HTMLElement | null = null
//         let _errorMsg: HTMLElement | string | null = null

//         Array.from(_nodes(`[name]`))
//             .forEach((el : any) => {

//                 let valid = true
//                 if ( el.required || el.with )
//                     valid = _validate(el)

                
//                 data[el.name] = {
//                     valid: valid,
//                     value: el.value
//                 }

//                 if ( !valid ){
//                     if ( _error == null ){
//                         _error = el
//                         _errorMsg = errors[el.name]
//                     }
//                     el.classList.add(`input-with-error`)
//                 }else
//                     el.classList.remove(`input-with-error`)            
                
//             })

//         if ( _error )
//             (_error as HTMLElement).focus()

//         return {
//             error: _error != null,
//             errorMsg: _errorMsg || `Fix errors to continue...`,
//             data
//         }
            
//     }

//     const _onSubmit = ( ) => {
        
//         const data = _buildFormData()

//         if ( data.error ){
//             sheet.current!.show(data.errorMsg, 4, SHEET.Error)
//         }
//         else{
//             setLoading(true)
//         }

//         // if ( props.onSubmit ) {

            
//         //     // if ( data ){
//         //     //     if ( props.onPost )
//         //     //         props.onPost( data )
//         //     //     else
//         //     //         props.onGet! ( data )
//         //     // }
                
//         // }
//         // else {
//         //     console.warn(`onSubmit missing for this form.`)
//         // }

//     }

//     useEffect(() => {
//         _init()
//     }, [])

//     return <div 
//         ref={_ref as unknown as RefObject<HTMLDivElement>}
//         className={`rel ${cx.join(` `)}`.trim()}
//         {...(cleanProps(props, [`withData`, `at`, `onSubmit`, `onSuccess`, `onError`]) as UIProps<HTMLDivElement>)}>

//             {/**
//              * Sheet
//              */}

//             <Sheet ref={sheet} />

//             {/**
//              * Cover Loader
//              */}
//             { loading && <Cover {...{ spinner, color: cover || `#ffffff` } as CoverProps} /> }

//             {children}
//         </div>

// }

export default Form