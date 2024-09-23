import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";

const Box = forwardRef<HTMLDivElement, { as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
    
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