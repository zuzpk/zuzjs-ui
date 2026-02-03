import { useMemo, useRef } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";

const Box = ({ 
    ref, 
    style,
    ...props 
}: BoxProps) => {

    const innerRef = useRef<HTMLDivElement>(null)
    const targetRef = useMemo(() => ref && typeof ref !== "function" && ref.current ? ref : innerRef, [ref])

    const {
        style: _style,
        className,
        rest
    } = useBase<`div`>(props, targetRef as any)

    return <div 
        ref={ref || innerRef}
        style={{
            ..._style,
            ...(style || {})
        }}
        className={className}
        {...rest} />
}

Box.displayName = `Zuz.Box`

export default Box