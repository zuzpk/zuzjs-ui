import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import { FORMVALIDATION } from "../types/enums";

const Input = forwardRef<HTMLInputElement, { required?: FORMVALIDATION, as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`input`>>((props, ref ) => {
    
    const { as, ...rest } = props;

    return <With 
        tag={`input`}
        as={as} 
        {...rest} 
        ref={ref} />

});

// import { DetailedHTMLProps, HTMLAttributes, InputHTMLAttributes, ReactNode, Ref } from "react";
// import { css, cleanProps } from "../funs";
// import { UIProps } from "../types/interfaces";
// import { FORMVALIDATION } from "../types/enums";

// export interface InputProps extends UIProps<HTMLInputElement> {
//     required?: FORMVALIDATION
// }

// const Input = ( props : InputProps ) => {

//     const { cx } = css.Build(props.as)

//     // console.log(`inputing...`)

//     return <input 
//         ref={props.ref}
//         className={cx.join(` `)}
//         {...(cleanProps(props) as UIProps<HTMLInputElement>)} />

// }

export default Input