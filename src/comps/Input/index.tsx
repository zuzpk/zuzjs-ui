"use client"
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import { FORMVALIDATION, Size, Variant } from '../../types/enums';

export type InputProps = Props<`input`> & {
    numeric?: boolean,
    size?: Size,
    variant?: Variant,
    with?: FORMVALIDATION | `${FORMVALIDATION}${string}`,
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void,
}

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {

    const { size, variant, numeric, onConfirm, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }
 
    return <input
        className={`--input ${size || variant ? `--${size || variant}` : ``} flex ${className}`.trim()}
        style={style}
        onInput={handleInput}
        onKeyDown={(e) => {
            if ( e.key == `Enter` ){
                onConfirm?.(e.currentTarget.value);
            }
        }}
        ref={ref}
        {...rest} />
        
})

Input.displayName = `Zuz.Input`

export default Input