"use client"
import { forwardRef } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';

export type SpanProps = Props<`span`> & {}

const Span = forwardRef<HTMLSpanElement, SpanProps>((props, ref) => {

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

})

export default Span