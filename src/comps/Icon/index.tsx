import { forwardRef, ReactNode } from "react"
import { useBase } from "../../hooks"
import Span from "../Span"
import { IconProps } from "./types";
import { Variant } from "../../types/enums";

const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {

    const { name, pathCount, size, color, ...pops } = props;

    const {
        className,
        style,
        rest
    } = useBase<"div">(pops);

    return <div
        style={{
            color,
            ...style,
        }}
        className={`icon-${name} --icon --${size || Variant.Default} ${className}`.trim()}
        ref={ref} 
        {...rest}>
            {Array(pathCount || 0).fill(0).map((p, i) => <Span
                key={`${name}-layer-${i}`}
                className={`path${i+1}`}
            />)}
        </div>

})

Icon.displayName = `Zuz.Icon`

export default Icon