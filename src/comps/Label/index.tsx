"use client"
import { createElement, forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import { isUrl } from '../../funs';

export type LabelProps = Props<`label`> & {}

const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {

    const {
        style,
        className,
        rest
    } = useBase<"label">(props)
 
    return <label
        ref={ref}
        style={style}
        className={className}
        {...rest} />

})

export default Label