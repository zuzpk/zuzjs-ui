"use client"
import { ComponentPropsWithoutRef, forwardRef, SyntheticEvent, useEffect, useMemo, useRef, useState } from "react";
import With, { animationProps } from "./base";
import { FORMVALIDATION } from "../types/enums";
import { dynamicObject } from "../types";
import { uuid } from "../funs";
import { op } from "@tensorflow/tfjs-node";

export interface SelectProps {
    as?: string,
    name?: string,
    animate?: animationProps,
    required?: FORMVALIDATION,
    options: dynamicObject[],
    label?: string,
    defaultValue?: string | dynamicObject,
    onChange?: (v : string | dynamicObject) => void,
}

export interface SelectHandler {
    onChange?: (v : string | dynamicObject) => void
}

const chevronExpand = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-expand" viewBox="0 0 16 16">
    <path 
        fillRule="evenodd"
        d="M3.646 9.146a.5.5 0 01.708 0L8 12.793l3.646-3.647a.5.5 0 01.708.708l-4 4a.5.5 0 01-.708 0l-4-4a.5.5 0 010-.708zm0-2.292a.5.5 0 00.708 0L8 3.207l3.646 3.647a.5.5 0 00.708-.708l-4-4a.5.5 0 00-.708 0l-4 4a.5.5 0 000 .708z" />
</svg>

const Select = forwardRef<SelectHandler, SelectProps>((props, ref) => {
    
    const { as, options, name, label, defaultValue, onChange, ...rest } = props;
    const _ref = useRef<HTMLDivElement>(null);
    const _id = useMemo(() => name || uuid(), [])
    const [ choosing, setChoosing ] = useState(false)
    const [ value, setValue ] = useState<string | dynamicObject>(defaultValue || options[0])
    
    const updateValue = (o: string | dynamicObject) => {
        setValue(o)
        onChange && onChange(o)
    }

    useEffect(() => {
        document.body.addEventListener(`click`, (e: MouseEvent) => {
            setChoosing(false)
        })
    }, [])

    return <>
        <With 
            popovertarget={_id}
            tag={`button`}
            as={as} 
            className={`zuz-select rel flex aic`}
            ref={_ref} 
            onClick={(e: MouseEvent) => setChoosing(true)}   
            {...rest} >
            <With tag={`h2`} className={`zuz-selected`}>{value ? `string` == typeof value ? value : value.value : label || `Choose`}</With>
            {chevronExpand()}
        </With>
        <With
            popover={true}
            id={_id}          
            className={`zuz-select-options abs flex cols`}
            style={{
                pointerEvents: choosing ? `auto` : `none`,
            }}
            animate={{
                from: { height: 0, opacity: 0 },
                to: { height: `auto`, opacity: 1 },
                when: choosing,
                curve: `spring`,
                duration: .4
            }}>
            {options.map((o: string | dynamicObject) => <With 
                key={`option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`}               
                onClick={(e: MouseEvent) => updateValue(o)}
                className={ value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}
                tag={`button`}>{`string` == typeof o ? o : o.label}</With>)}
        </With>
    </>

});

export default Select