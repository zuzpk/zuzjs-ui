import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";

const Animate = forwardRef<HTMLDivElement, { as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`div`>>((props, ref ) => {
    
    const { as, ...rest } = props;

    return <With as={as} {...rest} ref={ref} />

});

export default Animate