"use client"
import { forwardRef } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';

export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {

    const { autoResize, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"textarea">(pops)

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        
    }

    return <textarea
        className={`--input --textarea flex ${className}`.trim()}
        style={style}
        onInput={handleInput}
        ref={ref}
        {...rest} />
        
})

export default TextArea