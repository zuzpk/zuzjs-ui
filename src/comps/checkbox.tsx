"use client"
import { ChangeEvent, ComponentPropsWithoutRef, forwardRef, useImperativeHandle, useRef, useState } from "react";
import With, { animationProps } from "./base";
import { CHECKBOX } from "../types/enums";

export interface CheckboxProps { 
    as?: string, 
    type?: CHECKBOX, 
    required?: boolean,
    name?: string,
    value?: string,
    checked?: boolean,
    onChange?: (checked: boolean, value: string | string[]) => void,
    animate?: animationProps 
}

export interface CheckboxHandler {
    setChecked: (mode: boolean, triggerChange?: boolean) => void,
    toggle: (triggerChange?: boolean) => void,
}

// const CheckBox = forwardRef<HTMLButtonElement, { as?: string, type?: CHECKBOX, animate?: animationProps } & ComponentPropsWithoutRef<`input`>>((props, ref) => {
const CheckBox = forwardRef<CheckboxHandler, CheckboxProps>((props, ref) => {
    
    const { as, name, required, type, value, checked: defaultCheck, onChange, ...rest } = props;
    const [ checked, _setChecked ] = useState(defaultCheck || false)

    const bRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange=true){
            _setChecked(mod)
            if (bRef.current) {
                bRef.current.checked = mod;
            }
            if ( triggerChange && onChange )
                onChange(mod, value || `cb`)
        },
        toggle(triggerChange=true){
            if (bRef.current)
                bRef.current.checked = !checked;
            
            if ( triggerChange && onChange )
                onChange && onChange(!checked, value || `cb`)

            _setChecked(!checked)            
        }
    }))

    return <With tag={`label`} className={`${type == CHECKBOX.Default ? `checkbox icon-check` : `zuz-checkbox`} flex aic jcc ${checked ? `is-checked` : ``} rel`.trim()} as={as} {...rest}>
        <With tag={`input`} 
            ref={bRef} 
            defaultChecked={checked}
            value={value || `cb`}
            type={`checkbox`}  
            className={`abs`}
            name={name}
            required={required || false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onChange && onChange(e.target.checked, value || `cb`)
                _setChecked(e.target.checked)
            }} />
    </With>

});

// import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref, useState } from "react";
// import { cleanProps, css } from "../funs";
// import { UIProps } from "../types/interfaces";

// const CheckBox = ( props : UIProps<HTMLInputElement> ) => {

//     const { cx } = css.Build(props.as)
//     const [ checked, setChecked ] = useState(props.checked || false)

//     return <label { ...({
//         className: `zuz-checkbox${checked ? ` is-checked` : ``} rel${cx.length > 0 ? ` ` + cx.join(` `) : ``}`
//     }) as UIProps<HTMLLabelElement>}>
//         <input type='checkbox' 
//             ref={props.ref}
//             onChange={e => {
//                 setChecked(e.target.checked)
//             }}
//             className={`abs`}
//             {...(cleanProps(props) as UIProps<HTMLInputElement>)} />
//     </label>

// }

export default CheckBox