"use client"
import { useBase } from '../../hooks';
import { Variant } from '../../types';
import { InputProps } from './types';

const Input = ({ ref, ...props } : InputProps) => {

    const { 
        variant = Variant.Small, 
        numeric, onConfirm, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }
 
    return <input
        className={`--input --${variant} flex ${className}`.trim()}
        style={style}
        onInput={handleInput}
        onKeyDown={(e) => {
            if ( e.key == `Enter` ){
                onConfirm?.(e.currentTarget.value);
            }
        }}
        ref={ref}
        {...rest} />
        
}

Input.displayName = `Zuz.Input`

export default Input