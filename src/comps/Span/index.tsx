"use client"
import { useBase } from '../../hooks';
import { SpanProps } from './types';

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