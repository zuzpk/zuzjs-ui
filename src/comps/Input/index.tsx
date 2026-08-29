"use client"
import { useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types';
import { useFormActions, useFormFieldError, useFormFieldValue } from '../Form/context';
import { InputProps } from './types';

/**
 * Input component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Input placeholder="Enter text..." onChange={(e) => console.log(e.target.value)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Input placeholder="Email" type="email" variant="primary" disabled={false} onConfirm={(value) => console.log(value)} />
 * ```
 * @param placeholder - Placeholder text
 * @param onChange - Callback function triggered when value changes
 * @param type - Component or input type
 * @param variant - Visual variant or style
 * @param onConfirm - Callback function triggered on confirmation
 */
const Input = ({ ref, ...props } : InputProps) => {

    const { 
        variant, 
        numeric, 
        name,
        onConfirm,
        defaultValue,
        value,
        ...pops 
    } = props

    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)

    const { variant: themeVariant } = useTheme(true)!
    const inputRef = useRef<HTMLInputElement>(null);
    const form = useFormActions()
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
    const setFieldValue = form?.setFieldValue
    const deleteFieldValue = form?.deleteFieldValue
    const inForm = Boolean(name && setFieldValue)

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {

        let val = event.currentTarget.value;
        
        if (numeric) {
            val = val.replace(/[^0-9.]/g, '').replace(/(\..{0,}?)\..*/, '$1');
            event.currentTarget.value = val; // Reflect clean value back to DOM immediately
        }

        if (inForm && name) setFieldValue?.(name, val);

        props.onInput?.(event);

    }

    // If the store value changes externally, update the DOM value
    useEffect(() => {
        if (inputRef.current && name && formValue !== undefined) {
            if (inputRef.current.value !== String(formValue)) {
                inputRef.current.value = String(formValue);
            }
        }
    }, [formValue, name]);

    useEffect(() => {
        return () => {
            if (inForm && name) deleteFieldValue?.(name);
        };
    }, [deleteFieldValue, inForm, name]);
 
    return <input
        name={name}
        className={`--input --${variant || themeVariant || Variant.Medium} ${error ? '--has-error' : ''} --flex ${className}`.trim()}
        style={style}
        {...(value === undefined ? { defaultValue: formValue ?? defaultValue ?? "" } : { value })}
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