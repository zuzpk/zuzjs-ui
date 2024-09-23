import { ComponentPropsWithoutRef, forwardRef } from "react";
import With, { animationProps } from "./base";
import { SPINNER } from "../types/enums";
import { dynamicObject } from "../types";
import { hexToRgba } from "../funs";

export interface SpinnerProps extends ComponentPropsWithoutRef<`div`> {
    as?: string,
    animate?: animationProps,
    type?: SPINNER,
    size?: number,
    width?: number,
    color?: string,
    background?: string,
    foreground?: string,
    speed?: number,
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps >((props, ref) => {
    
    const { as, type, width, speed, size, color, background, foreground, ...rest } = props;
    const defaultColor = `#000000`

    // console.log(`sp`, props)

    const buildSimple = () : dynamicObject => {

        const c = hexToRgba(color || defaultColor)
        const bg = hexToRgba(color || defaultColor, .3)
        
        const pops : dynamicObject = {
            width: size || 50,
            height: size || 50,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        }

        return pops

    }

    const build = () : dynamicObject => {
        let _ : dynamicObject = {}
        switch( type || SPINNER.Simple ){
            case SPINNER.Simple:
                _ = buildSimple()
                break;
        }
        return _
    }

    const getChild = () => {

        switch( type || SPINNER.Simple ){
            case SPINNER.Simple:
                break;
        }

        return null
    }

    return <With 
        as={as} 
        ref={ref}
        tag={`div`}
        className={`zuz-spinner${type ? `-${type.toLowerCase()}` : ``}`}
        style={build()}
        {...rest} >{getChild()}</With>

});

export default Spinner;