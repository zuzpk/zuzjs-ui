import React, { forwardRef } from "react";
import { useBase } from "../../hooks";
import { Props } from "../../types";

export interface BoxProps extends Partial<Props<`div`>> {
    name?: string
}

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    const { style, withEditor, ...pops } = props
    const { 
        style : _style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    const handleInternalClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // if ( withEditor && isBrowser ) {
        //     // window.dispatchEvent(new CustomEvent(`ZUZ_COMP_SELECTED`, {
        //     //     detail: {
        //     //         compName: 'Box',
        //     //         target: e.target,
        //     //         props
        //     //     }
        //     // }))
        // }
    }

    return <div
        ref={ref}
        onClick={handleInternalClick}
        className={`${className} ${withEditor ? `--with-zuz-editor` : ``}`.trim()}
        style={{
            ..._style,
            ...(style || {})
        }}
        {...rest}
    />
    
})

Box.displayName = `Box`

export default Box