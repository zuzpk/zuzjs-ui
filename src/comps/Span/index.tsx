"use client"
import { useBase } from '../../hooks';
import { SpanProps } from './types';

/**
 * Span component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Span>Text span</Span>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Span variant="muted" size="sm">Secondary text</Span>
 * ```
 * @param variant - Visual variant or style
 * @param size - Component size
 */
const Span = ({ 
    ref, 
    ...props 
} : SpanProps) => {

    const { style, ...pops } = props

    const {
        style: _style,
        className,
        rest
    } = useBase<"span">(pops)
 
    return <span
        ref={ref}
        style={style}
        className={className}
        { ...rest } />

}

Span.displayName = `Zuz.Span`

export default Span