import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import With, { animationProps } from "./base";
import { UIProps } from "../types/interfaces";

const Heading = forwardRef<HTMLDivElement, { as?: string, h?: number | string, html?: ReactNode | string, animate?: animationProps } & ComponentPropsWithoutRef<`h1` | `h2` | `h3` | `h4` | `h5` | `h6`>>((props, ref ) => {
    
    const { as, h, html, children, ...rest } = props;

    return <With 
        tag={`h${h || 1}`} 
        as={as} 
        ref={ref}
        {...rest} 
    >{props.html ? <span { ...({dangerouslySetInnerHTML:{ __html: html }}) as UIProps<HTMLSpanElement>} />  : children}</With>

});

// import { Ref } from "react"
// import { css, cleanProps } from "../funs";
// import { UIProps } from "../types/interfaces";

// const Heading = ( props: UIProps<HTMLHeadingElement> ) => {

//     const { children, ref, h, html } = props

//     let Tag : string = `h${h || 1}`;
//     const HeadingTag = Tag as `h1` | `h2` | `h3` | `h4` | `h5` | `h6`
//     const { cx } = css.Build(props.as)

//     return <HeadingTag 
//         ref={ref} 
//         className={cx.join(` `)}
//         {...(cleanProps(props) as UIProps<HTMLHeadingElement>)}>{props.html ? <span { ...({dangerouslySetInnerHTML:{ __html: html }}) as UIProps<HTMLSpanElement>} />  : children}</HeadingTag>

// }

export default Heading