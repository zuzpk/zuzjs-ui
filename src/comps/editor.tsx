import { ChangeEvent, forwardRef, ReactNode, RefObject, useState } from "react";
import { BaseProps } from "../types/interfaces";
import With from "./base";
import Pencil from "../media/edit-ui";
import { dynamicObject } from "../types";
import { DATATYPE, EDIT_TYPE, TRANSITIONS } from "../types/enums";
import Lexer from "../funs/lexer";
import { copyToClipboard } from "../funs";
import { useMounted } from "../hooks";

export interface EditorProps {
    title: string,
    attrs: dynamicObject,
    element: string,
}   

export interface EditorHandler {
    show: () => void,
}

const ComponentEditor = forwardRef<EditorHandler, EditorProps & BaseProps>((props, ref) => {

    const [ visible, setVisible ] = useState(false)
    const [ code, setCode ] = useState(false)
    const { title, attrs, element } = props
    const mounted = useMounted(500)

    const getVariable = (v: string) => {
        // console.log(element!.current)
        // const elm = document.querySelector(element!);
        // return getComputedStyle(document.querySelector(element)!).getPropertyValue(`--${v}`).trim()
        const a = getComputedStyle(document.querySelector(element) as HTMLElement).getPropertyValue(`--${v}`).trim()
        const b = getComputedStyle(document.body).getPropertyValue(`--${v}`).trim()
        const d = getComputedStyle(document.documentElement).getPropertyValue(`--${v}`).trim()
        return a || b || d
    }

    const expandHex = (hex: string) => {
        if (hex.length === 4) {
            return `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
        }
        return hex;
    };

    const rangeSlider = (k: string, value: number, min: number, max:number, step:number, unit?: string) => {
        return <>
        <With tag={`input`} type={`range`} 
            defaultValue={value} min={min} max={max} step={step} name={`editor-prop-range-${k}`}
            onChange={(e : ChangeEvent<HTMLInputElement>) => {
                // document.body.style.setProperty(`--${k}`,`${e.currentTarget.value}${unit || ``}`);
                (document.querySelector(element) as HTMLElement).style.setProperty(`--${k}`,`${e.currentTarget.value}${unit || ``}`);
                (document.querySelector(`input[name="editor-prop-num-${k}"]`) as HTMLInputElement).value = e.currentTarget.value
            }} />
        <With tag={`input`} type={`number`} name={`editor-prop-num-${k}`}
            defaultValue={value} min={min} max={max} 
            onChange={(e : ChangeEvent<HTMLInputElement>) => {
                (document.querySelector(element) as HTMLElement).style.setProperty(`--${k}`,`${e.currentTarget.value}${unit || ``}`);
                // document.body.style.setProperty(`--${k}`,`${e.currentTarget.value}${unit || ``}`);
                (document.querySelector(`input[name="editor-prop-range-${k}"]`) as HTMLInputElement).value = e.currentTarget.value
            }} />
        </>
    }

    const colorPicker = ( k:string, value:string ) => {
        return <>
        <With tag={`input`} type={`color`} 
            defaultValue={expandHex(value.toString())} name={`editor-prop-color-${k}`}
            onChange={(e : ChangeEvent<HTMLInputElement>) => {
                // document.body.style.setProperty(`--${k}`, e.currentTarget.value);
                (document.querySelector(element) as HTMLElement).style.setProperty(`--${k}`, e.currentTarget.value);
                (document.querySelector(`input[name="editor-prop-num-${k}"]`) as HTMLInputElement).value = e.currentTarget.value
            }} />
        <With tag={`input`} name={`editor-prop-num-${k}`}
            defaultValue={expandHex(value.toString())}
            onChange={(e : ChangeEvent<HTMLInputElement>) => {
                (document.querySelector(element) as HTMLElement).style.setProperty(`--${k}`,`${e.currentTarget.value}`);
                // document.body.style.setProperty(`--${k}`,`${e.currentTarget.value}px`);
                (document.querySelector(`input[name="editor-prop-color-${k}"]`) as HTMLInputElement).value = e.currentTarget.value
            }} />
        </>
    }

    const build = (at: dynamicObject) => {

        const comps : ReactNode[] = []
        Object.keys(at)
            .forEach((k: string) => {
                if ( k.startsWith('@group') ){
                    comps.push(
                        <With key={`egroup-${k}`} className={`group flex cols`}>
                            <With tag={`h1`} as={`glabel`}>{at[k].label}</With>
                            <With className={`gprops flex cols`}>
                                {build(at[k].pops)}
                            </With>
                        </With>
                    )
                }
                else {
                    
                    const { label, value, min, max, type, step, unit } = Lexer(at[k])
                    
                    comps.push(
                        <With key={`el-${k}-${label}`} className={`prop flex aic`}>
                            <With className={`pop flex cols`}>
                                <With tag={`h1`} as={`label`}>{label.split(`,`).join(` `)}</With>
                                <With tag={`h1`} as={`l-k`}>{k}</With>
                            </With>
                            <With className={`pop flex aic`}>
                                {type == `range` && rangeSlider(k, value == `auto` ? parseFloat(getVariable(k)) : value, min, max, step || 1, unit)}
                                {type == `color` && colorPicker(k, value == `auto` ? getVariable(k) : value)}
                            </With>
                        </With>
                    )
                
                }
            })        

        return comps
    }

    const getCode = (at: dynamicObject) => {
        const c : string[] = []

        Object.keys(at)
            .forEach((k: string) => {
                if ( k.startsWith('@group') ){
                    c.push(...getCode(at[k].pops))
                }
                else{
                    const { label, value, min, max, type, step, unit } = Lexer(at[k])
                    c.push(`--${k}: ${value == `auto` ? type == `range` ? parseFloat(getVariable(k)) : getVariable(k) : value}${unit || ``};`)
                }
            })
        
        return c //.join(`\n`)
    }

    if ( !mounted ) return null

    return <With as={`comp-editor fixed`}>

        <With tag={`button`} as={`pencil`} onClick={(e:MouseEvent) => setVisible(!visible)}>
            {!visible ? 
                <With tag={`img`} src={`data:image/png;base64,${Pencil}`} />
                : <With tag={`span`}>&times;</With>}
        </With>

        <With as={`editor-props fixed`} aria-hidden={!visible} animate={{
            transition: TRANSITIONS.SlideInRight,
            when: visible,
            duration: 0.1,
        }}>

            <With as={`editor-head flex aic`}>
                <With tag={`h1`} className={`head-label`}>{title} Editor</With>
                <With className={`head-action`}>
                    <With tag={`button`} onClick={(e:MouseEvent) => setCode(!code)}>{code ? `Edit` : `Get Code`}</With>
                </With>
            </With>
            <With as={`editor-body flex cols rel`}>
                {code ? <>
                    <With tag={`textarea`}>{getCode(attrs).join(`\n`)}</With>
                    <With tag={`button`} className={`copy abs`} onClick={(e:MouseEvent) => copyToClipboard(getCode(attrs).join(`\n`)).then(() => {
                        (document.querySelector(`.comp-editor .editor-props .editor-body .copy`) as HTMLButtonElement).textContent = `Copied`
                        setTimeout(() => (document.querySelector(`.comp-editor .editor-props .editor-body .copy`) as HTMLButtonElement).textContent = `Copy`, 3000)
                    })}>Copy</With>
                </> : build(attrs)}
            </With>

        </With>

    </With>

})

export default ComponentEditor
