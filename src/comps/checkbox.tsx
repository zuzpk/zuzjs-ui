"use client"
import { ChangeEvent, ComponentPropsWithoutRef, forwardRef, useState } from "react";
import With, { animationProps } from "./base";

const CheckBox = forwardRef<HTMLButtonElement, { as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`input`>>((props, ref ) => {
    
    const { as, name, required, ...rest } = props;

    const [ checked, setChecked ] = useState(props.checked || false)

    return <With tag={`label`} className={`zuz-checkbox${checked ? ` is-checked` : ``} rel`} as={as} {...rest}>
        <With tag={`input`} 
            ref={ref} 
            type={`checkbox`}  
            className={`abs`}
            name={name}
            required={required || false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setChecked(e.target.checked)} />
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