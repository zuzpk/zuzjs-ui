import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";

export interface ButtonProps {
    as?: string
    animate?: animationProps,
    icon?: string,
}

const Button = forwardRef<HTMLButtonElement, ButtonProps & ComponentPropsWithoutRef<`button`>>((props, ref ) => {
    
    const { as, icon, ...rest } = props;

    return <With tag={`button`} as={as} className={`flex aic ${icon ? `ico-btn` : ``}`.trim()} {...rest} ref={ref}>
        {icon && <With className={`icon-${icon}`} />}
        <With tag={`span`} className={`b-label`}>{props.children}</With>
    </With>

});

export default Button