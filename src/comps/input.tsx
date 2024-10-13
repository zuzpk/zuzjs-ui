import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import { FORMVALIDATION } from "../types/enums";

const Input = forwardRef<HTMLInputElement, { required?: FORMVALIDATION, textarea?: any, as?: string, animate?: animationProps } & ComponentPropsWithoutRef<`input`>>((props, ref ) => {
    
    const { as, textarea, value, ...rest } = props;

    return textarea ? <With 
        tag={`textarea`}
        as={as} 
        {...rest} 
        value={value}
        ref={ref} />
        : <With 
        tag={`input`}
        as={as} 
        value={value}
        {...rest} 
        ref={ref} />

});

export default Input