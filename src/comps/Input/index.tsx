"use client"
import { useDebounce } from '@zuzjs/hooks';
import { useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { useForm } from '../Form/context';
import { InputProps } from './types';

const Input = ({ ref, ...props } : InputProps) => {

    const { 
        variant, 
        numeric, 
        name,
        onConfirm, 
        ...pops 
    } = props

    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)

    const { variant: themeVariant } = useTheme(true)!
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useForm()
    const error = name ? form.errors?.[name] : null
    const inForm = name && form.values && form.setFieldValue
    const formValue = inForm ? form.values?.[name] : undefined;

    const updateFieldValue = useDebounce((val) => {
        if (inForm) {
            form.setFieldValue?.(name, val);
        }
    }, 500)

    // If the store value changes externally, update the DOM value
    useEffect(() => {
        if (inputRef.current && name && formValue !== undefined) {
            if (inputRef.current.value !== String(formValue)) {
                inputRef.current.value = String(formValue);
            }
        }
    }, [formValue, name]);

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {

        let val = event.currentTarget.value;
        
        if (numeric) {
            val = val.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');
            event.currentTarget.value = val; // Reflect clean value back to DOM immediately
        }

        updateFieldValue(val)

        props.onInput?.(event);

    }
 
    return <input
        name={name}
        className={`--input --${variant || themeVariant} ${error ? '--has-error' : ''} --flex ${className}`.trim()}
        style={style}
        defaultValue={formValue ?? props.defaultValue ?? ""}
        onInput={handleInput}
        onKeyDown={(e) => {
            if ( e.key == `Enter` ){
                onConfirm?.(e.currentTarget.value);
            }
        }}
        ref={(node) => {
            // Handle both our internal ref and the forwarded ref
            (inputRef as any).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as any).current = node;
        }}
        {...rest} />
        
}

Input.displayName = `Zuz.Input`

export default Input