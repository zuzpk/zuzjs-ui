import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";

const Icon = forwardRef<HTMLDivElement, { name: string, as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
    
    const { as, name, ...rest } = props;

    return <With 
        className={`icon-${name}`}
        as={as} 
        {...rest} 
        ref={ref} />

});

// import { DetailedHTMLProps, HTMLAttributes, ReactNode, Ref } from "react";
// import { css, cleanProps } from "../funs";
// import { UIProps } from "../types/interfaces";

// const Icon = ( props : UIProps<HTMLDivElement> ) => {

//     const { cx } = css.Build(props.as)

//     return <div 
//         ref={props.ref}
//         className={`icon-${props.name}${cx.length > 0 ? ` ` + cx.join(` `) : ``}`}
//         {...(cleanProps(props) as UIProps<HTMLDivElement>)}>{props.children}</div>

// }

export default Icon