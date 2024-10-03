import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import Spinner, { SpinnerProps } from "./spinner";
import { hexToRgba } from "../funs";

export interface CoverProps extends ComponentPropsWithoutRef<`div`> { 
    tag?: string, 
    message?: string, 
    spinner?: SpinnerProps,
    color?: string,
    as?: string,
    animate?: animationProps,
    when?: boolean
}

const Cover = forwardRef<HTMLDivElement, CoverProps>((props, ref ) => {
    
    const { spinner, message, color, as, when, ...rest } = props;
    
    if ( `when` in props && props.when == false ){
        return null
    }

    return (
        <With 
            className={`zuz-cover flex aic jcc cols abs fillx nope nous`}
            ref={ref} 
            style={{
                backgroundColor: `var(--cover-bg)`
            }}    
            as={as}
            {...rest} 
        >
            {<Spinner {...{
                ...spinner
            } as SpinnerProps} />}
            {<With tag={`h1`} className={`label`} style={{ color: `var(--cover-label)` }}>{message || `loading`}</With>}
            {/* {message && <With tag={`h1`} className={`label`}>{message}</With>} */}
        </With>
    );
    // return (
    //     <With 
    //         className={`zuz-cover flex aic jcc cols abs fill nope nous`}
    //         ref={ref} 
    //         style={{
    //             backgroundColor: color ? !color.startsWith(`#`) ? hexToRgba(color, .9) : color : hexToRgba(color || `var(--cover)`, .9)
    //         }}    
    //         as={as}
    //         {...rest} 
    //     >
    //         {<Spinner {...spinner} />}
    //         {<With tag={`h1`} className={`label`}>{message || `loading`}</With>}
    //         {/* {message && <With tag={`h1`} className={`label`}>{message}</With>} */}
    //     </With>
    // );
});

export default Cover