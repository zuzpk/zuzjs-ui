import { forwardRef, useMemo, useRef } from "react";
import { useBase } from "../../hooks";
import { Props } from "../../types";

export interface BoxProps extends Partial<Props<`div`>> {
    name?: string
}

const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
    
    const { style, withEditor, ...pops } = props
    const innerRef = useRef<HTMLDivElement>(null)
    const targetRef = useMemo(() => ref && typeof ref !== "function" && ref.current ? ref : innerRef, [ref])
    
    const { 
        style : _style, 
        className, 
        rest 
    } = useBase<`div`>(pops, targetRef as any)

    return <div
        ref={ref || innerRef}
        className={`${className} ${withEditor ? `--with-zuz-editor` : ``}`.trim()}
        style={{
            ..._style,
            ...(style || {})
        }}
        {...rest}
    />
    
})

Box.displayName = `Zuz.Box`

export default Box