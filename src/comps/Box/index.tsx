import { useMemo, useRef } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";

/**
 * Box component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Box>Content goes here</Box>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Box padding="lg" variant="subtle" borderRadius="md" shadow="sm">Styled container with spacing and effects</Box>
 * ```
 * @param padding - padding prop
 * @param variant - Visual variant or style
 * @param borderRadius - borderRadius prop
 * @param shadow - shadow prop
 */
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