import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import { BaseProps } from "../types/interfaces";

// const Box = forwardRef<HTMLDivElement, { as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
const Box = forwardRef<HTMLDivElement, BaseProps & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
// const Box = forwardRef<HTMLDivElement, BaseProps>((props, ref ) => {
    
    const { as, ...rest } = props;

    return <With as={as} {...rest} ref={ref} />

});

// const Box = ( props : UIProps<HTMLDivElement> ) => {

    // const { cx } = css.Build(props.as)

    // return <div 
    //     ref={props.ref}
    //     className={cx.join(` `)}
    //     {...(cleanProps(props) as UIProps<HTMLDivElement>)}>{props.children}</div>

// }

export default Box