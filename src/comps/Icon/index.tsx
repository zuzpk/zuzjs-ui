import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types/enums";
import Span from "../Span";
import { IconProps } from "./types";

/**
 * Icon component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Icon name="star" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Icon name="star" variant="lg" color="gold" />
 * ```
 * @param name - name prop
 * @param variant - Visual variant or style
 * @param color - color prop
 */
const Icon = forwardRef<HTMLDivElement, IconProps>((props, ref) => {

    const { name, pathCount, variant, color, size, prefix, animated, ...pops } = props;
    const { variant: themeVariant } = useTheme(true)!
    const {
        className,
        style,
        rest
    } = useBase<"div">(pops);

    return <div
        style={{
            color,
            ...style,
            ...(size ? { fontSize: size } : {})
        }}
        className={`${prefix ?? `icon`}-${name} --icon --${variant || themeVariant || Variant.Small} ${className}`.trim()}
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