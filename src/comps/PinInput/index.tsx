"use client"
import { ChangeEventHandler, forwardRef, useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types';
import Box from '../Box';
import Input from '../Input';
import { InputProps } from '../Input/types';

export type PinInputProps = InputProps & {
    mask?: boolean, 
    size?: number,
    length?: number,
}

const PinInput = forwardRef<HTMLInputElement, PinInputProps>((props, ref) => {

    const { size, length, mask, ...pops } = props
    const inputs = useRef<(HTMLInputElement | null)[]>([])
    
    let name = `pinput`
    let required = false
    let _with = {}
    if ( `with` in pops ){
        _with = { with: pops.with }
        delete pops.with
    }
    if ( `type` in pops ){
        delete pops.type
    }
    if ( `name` in pops ){
        name = pops.name as string
        delete pops.name
    }
    if ( `required` in pops ){
        required = true
        delete pops.required
    }

    const {
        style
    } = useBase(pops)

    const handleInput: ChangeEventHandler<HTMLInputElement> = (event) => {
        const input = event.currentTarget
        const nextInput = inputs.current[ parseInt(input.dataset.index!) + 1 ]
        const prevInput = inputs.current[ parseInt(input.dataset.index!) - 1 ]
        if (input.value.length === 1 && nextInput) {
            nextInput.focus();
        }
        else if (input.value.length === 0 && prevInput) {
            prevInput.focus();
        }
    }

    const { variant: themeVariant } = useTheme(true)!
    
    useEffect(() => {
        inputs.current = inputs.current.slice(0, size || length);
    }, [size || length]);
 
    return <Box 
        name={name}
        style={style}
        className={`--otp --${pops.variant ?? themeVariant ??  Variant.Medium} flex aic rel`}
        data-required={required}
        data-size={size || length || 4}
        {..._with}>
        {Array(size || length || 4).fill(1).map((a, i) => <Input 
            autoComplete="new-password"
            data-index={i}
            key={`pin-${i}`}
            ref={(el : HTMLInputElement | null) => {
                inputs.current[i] = el
            }}
            numeric={true}
            onChange={handleInput}
            maxLength={1}
            placeholder={mask ? `·` : `0`}
            type={mask ? `password` : 'text'}
            {...pops} />)}
    </Box>
        
})

PinInput.displayName = `Zuz.PinInput`

export default PinInput