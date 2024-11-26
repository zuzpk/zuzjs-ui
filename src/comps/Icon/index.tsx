"use client"
import { forwardRef, ReactNode } from "react"
import { useBase } from "../../hooks"
import { BoxProps } from "../Box"
import Span, { SpanProps } from "../Span"
import { Size } from "../../types/enums"

export type IconProps = Omit<BoxProps, `name`> & {
    name: string | ReactNode,
    pathCount?: number,
    size?: Size
}

const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {

    const { name, pathCount, size, ...pops } = props;

    const {
        className,
        style,
        rest
    } = useBase<"div">(pops);

    return <div
        style={style}
        className={`icon-${name} --icon --${size || Size.Default} ${className}`.trim()}
        ref={ref} 
        {...rest}>
            {Array(pathCount || 0).fill(0).map((p, i) => <Span
                key={`${name}-layer-${i}`}
                className={`path${i+1}`}
            />)}
        </div>

})

export default Icon