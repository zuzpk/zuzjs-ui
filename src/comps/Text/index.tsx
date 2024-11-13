"use client"
import { createElement, forwardRef, HTMLAttributes, ReactNode } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Span from '../Span';

export type TextProps = Props<`h1` | `h2` | `h3` | `h4` | `h5` | `h6`> & {
    h?: number,
    html?: ReactNode | string,
}

const Text = forwardRef<HTMLHeadingElement, TextProps>((props, ref) => {

    const { h, html, children, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase(pops)
 
    const Tag = `h${props.h || 1}`

    return createElement(
        Tag,
        {
            ref,
            style,
            className,
            ...rest
        },
        html ? <Span dangerouslySetInnerHTML={{ __html: html }} /> : children
    )

})

export default Text