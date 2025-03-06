"use client"
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import { Variant } from '../../types/enums';

export type TextAreaProps = Props<`textarea`> & {
    autoResize?: boolean,
    resize?: `none` | `block` | `both` | `horizontal` | `vertical`,
    variant?: Variant
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {

    const { autoResize, variant, resize, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"textarea">(pops)

    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        
    }

    return <textarea
        className={`--input --textarea --${variant || Variant.Small} flex ${className}`.trim()}
        style={{ ...style, resize: resize || `none` }}
        onInput={handleInput}
        ref={ref}
        {...rest} />
        
})

TextArea.displayName = `TextArea`

export default TextArea