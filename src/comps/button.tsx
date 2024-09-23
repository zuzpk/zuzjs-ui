import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";

const Button = forwardRef<HTMLButtonElement, { as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`button`>>((props, ref ) => {
    
    const { as, ...rest } = props;

    return <With tag={`button`} as={as} {...rest} ref={ref} />

});

// import { Ref } from "react";
// import { css, cleanProps } from "../funs";
// import { UIProps } from "../types/interfaces";

// const Button = ( props: UIProps<HTMLButtonElement> ) => {

//     const { as, ref, children } = props
//     const { cx } = css.Build(as)

//     return <button
//         ref={ref}
//         className={cx.join(` `)}
//         {...(cleanProps(props) as UIProps<HTMLButtonElement>)}>{children}</button>

// }

export default Button