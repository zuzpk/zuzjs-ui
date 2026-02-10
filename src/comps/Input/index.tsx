"use client"
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types';
import { InputProps } from './types';

const Input = ({ ref, ...props } : InputProps) => {

    const { 
        variant, 
        numeric, onConfirm, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)

    const { variant: themeVariant } = useTheme(true)!

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }
 
    return <input
        className={`--input --${variant || themeVariant} flex ${className}`.trim()}
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