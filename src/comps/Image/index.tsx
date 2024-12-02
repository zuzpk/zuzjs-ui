"use client"
import { createElement, forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import { isUrl } from '../../funs';

export type ImageProps = Props<`img`> & {
    
}

const Image = forwardRef<HTMLImageElement, ImageProps>((props, ref) => {

    const {
        style,
        className,
        rest
    } = useBase<"img">(props)
    
    if ( !rest.src || rest.src == `` ) return null

    return <img 
        ref={ref}
        style={style}
        className={`${className} flex`}
        {...rest} />

})

export default Image