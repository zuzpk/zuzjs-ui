"use client"
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import { Variant } from '../../types/enums';

export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean,
    variant?: Variant
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {

    const { autoResize, variant, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"textarea">(pops)

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        
    }

    return <textarea
        className={`--input --textarea --${variant || Variant.Small} flex ${className}`.trim()}
        style={style}
        onInput={handleInput}
        ref={ref}
        {...rest} />
        
})

TextArea.displayName = `TextArea`

export default TextArea