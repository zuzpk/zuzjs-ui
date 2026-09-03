"use client"
import { useEffect, useRef, useCallback } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types';
import { useFormActions, useFormFieldError, useFormFieldValue } from '../Form/context';
import { InputProps } from './types';

/**
 * Pattern characters for validation:
 * - `0` - numeric (0-9)
 * - `A` - alphabetic (a-z, A-Z)
 * - `Z` - alphanumeric (a-z, A-Z, 0-9)
 * - `S` - any character (no validation)
 */
const PATTERN_CHARS = {
    NUMERIC: '0',
    ALPHA: 'A',
    ALPHANUMERIC: 'Z',
    ANY: 'S'
} as const;

const isPatternChar = (char: string): boolean => {
    return char === PATTERN_CHARS.NUMERIC || 
           char === PATTERN_CHARS.ALPHA || 
           char === PATTERN_CHARS.ALPHANUMERIC || 
           char === PATTERN_CHARS.ANY;
};

const validateChar = (char: string, pattern: string): boolean => {
    if (!char) return false;
    
    switch (pattern) {
        case PATTERN_CHARS.NUMERIC:
            return /[0-9]/.test(char);
        case PATTERN_CHARS.ALPHA:
            return /[a-zA-Z]/.test(char);
        case PATTERN_CHARS.ALPHANUMERIC:
            return /[a-zA-Z0-9]/.test(char);
        case PATTERN_CHARS.ANY:
            return true;
        default:
            return false;
    }
};

/**
 * Input component with advanced masking and pattern validation.
 * 
 * @description
 * A text input field that integrates with Form context for validation and supports
 * advanced input masking with pattern-based character validation.
 * 
 * @example
 * // Basic usage
 * ```tsx
 * <Input placeholder="Enter text..." onChange={(e) => console.log(e.target.value)} />
 * ```
 * 
 * @example
 * // Phone number with numeric validation
 * ```tsx
 * <Input 
 *   mask={{ mask: '(000) 000-0000' }} 
 *   placeholder="(___) ___-____"
 * />
 * ```
 * 
 * @example
 * // Custom pattern: 000A-BB123-BBBB9
 * // 3 digits, 1 letter, separator, 2 letters, literal '123', separator, 4 letters, 1 digit
 * ```tsx
 * <Input 
 *   mask={{ 
 *     mask: '000A-BB123-BBBB9',
 *     placeholder: '___A-BB123-BBBB9'
 *   }}
 * />
 * ```
 * 
 * @example
 * // Date input with clear on blur
 * ```tsx
 * <Input 
 *   mask={{ 
 *     mask: '00/00/0000',
 *     clearMaskOnBlur: true
 *   }}
 *   placeholder="MM/DD/YYYY"
 * />
 * ```
 * 
 * @param {string} [name] - Field name for form data
 * @param {boolean} [numeric] - Restricts input to numbers only
 * @param {Variant} [variant] - Size variant (xs, sm, md, lg, xl)
 * @param {WithFormValidation} [with] - Validation rules object
 * @param {(value: string) => void} [onConfirm] - Callback fired on Enter/Return
 * @param {InputMaskOptions} [mask] - Mask configuration for pattern-based input
 * 
 * @see InputMaskOptions for mask pattern syntax:
 * - Pattern character `0` = numeric (0-9)
 * - Pattern character `A` = alphabetic (a-z, A-Z)
 * - Pattern character `Z` = alphanumeric (a-z, A-Z, 0-9)
 * - Pattern character `S` = any character (no validation)
 * - Any other character = fixed separator (shown as literal)
 * 
 * @example
 * // Pattern examples:
 * // '000-00-0000' → 3 digits, dash, 2 digits, dash, 4 digits (SSN)
 * // '(000) 000-0000' → Phone number with digits only
 * // 'AAAA-BBBB' → 4 letters, dash, 4 letters (license key)
 * // 'ZZZZ-ZZZZ' → 4 alphanumeric, dash, 4 alphanumeric (any letters or numbers)
 * // '00/AA/0000' → 2 digits, slash, 2 letters, slash, 4 digits (custom date code)
 */
const Input = ({ ref, ...props } : InputProps) => {

    const { 
        variant, 
        numeric, 
        name,
        onConfirm,
        defaultValue,
        value,
        mask,
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

    // Mask configuration
    const maskPattern = mask?.mask || '';
    const placeholderMask = mask?.placeholder || maskPattern;
    const showMaskOnFocus = mask?.showMaskOnFocus !== false;
    const clearMaskOnBlur = mask?.clearMaskOnBlur === true;

    /**
     * Convert pattern character to placeholder
     */
    const getPlaceholderChar = (patternChar: string): string => {
        return isPatternChar(patternChar) ? patternChar : patternChar;
    };

    /**
     * Get display placeholder string
     */
    const getDisplayPlaceholder = useCallback((): string => {
        if (!maskPattern) return '';
        
        let result = '';
        for (let i = 0; i < maskPattern.length; i++) {
            const char = maskPattern[i];
            if (isPatternChar(char)) {
                result += placeholderMask ? (placeholderMask[i] || char) : char;
            } else {
                result += char;
            }
        }
        return result;
    }, [maskPattern, placeholderMask]);

    /**
     * Apply mask to value with validation
     */
    const applyMask = useCallback((value: string): string => {
        if (!maskPattern) return value;

        let result = '';
        let valueIndex = 0;
        
        for (let i = 0; i < maskPattern.length && valueIndex < value.length; i++) {
            const patternChar = maskPattern[i];
            
            if (isPatternChar(patternChar)) {
                // Validate and accept character
                const char = value[valueIndex];
                if (validateChar(char, patternChar)) {
                    result += char;
                    valueIndex++;
                } else {
                    // Invalid character, try next input character
                    valueIndex++;
                    i--; // Stay at same mask position
                }
            } else {
                // Fixed separator
                result += patternChar;
            }
        }
        
        return result;
    }, [maskPattern]);

    /**
     * Get raw value without mask
     */
    const getRawValue = useCallback((value: string): string => {
        if (!maskPattern) return value;
        
        let result = '';
        for (let i = 0; i < value.length; i++) {
            const patternChar = maskPattern[i];
            if (patternChar && isPatternChar(patternChar)) {
                result += value[i];
            }
        }
        return result;
    }, [maskPattern]);

    /**
     * Check if masked value is complete
     */
    const isMaskComplete = useCallback((value: string): boolean => {
        if (!maskPattern) return true;
        
        for (let i = 0; i < maskPattern.length; i++) {
            const patternChar = maskPattern[i];
            if (isPatternChar(patternChar)) {
                if (!value[i] || !validateChar(value[i], patternChar)) {
                    return false;
                }
            }
        }
        return true;
    }, [maskPattern]);

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {

        let val = event.currentTarget.value;
        
        if (numeric) {
            val = val.replace(/[^0-9.]/g, '').replace(/(\..{0,}?)\..*/, '$1');
            event.currentTarget.value = val;
        } else if (maskPattern) {
            // Handle mask input with validation
            const rawValue = getRawValue(val);
            const maskedValue = applyMask(rawValue);
            event.currentTarget.value = maskedValue;
            val = maskedValue;
        }

        if (inForm && name) setFieldValue?.(name, val);

        props.onInput?.(event);

    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (maskPattern && e.key === 'Backspace') {
            const value = e.currentTarget.value;
            const cursorPos = e.currentTarget.selectionStart || 0;
            
            // Find previous pattern character
            let newCursorPos = cursorPos - 1;
            while (newCursorPos >= 0 && !isPatternChar(maskPattern[newCursorPos])) {
                newCursorPos--;
            }
            
            if (newCursorPos >= 0 && isPatternChar(maskPattern[newCursorPos])) {
                // Delete the character at the pattern position, replace with placeholder
                const placeholder = getPlaceholderChar(maskPattern[newCursorPos]);
                const newValue = value.substring(0, newCursorPos) + placeholder + value.substring(newCursorPos + 1);
                e.currentTarget.value = newValue;
                
                // Prevent default backspace behavior
                e.preventDefault();
                
                // Set cursor position
                setTimeout(() => {
                    e.currentTarget.setSelectionRange(newCursorPos, newCursorPos);
                }, 0);
                
                // Trigger input event
                if (inForm && name) setFieldValue?.(name, newValue);
            }
        }
        
        if (e.key === 'Enter') {
            onConfirm?.(e.currentTarget.value);
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (maskPattern && showMaskOnFocus) {
            const value = e.currentTarget.value;
            if (!value) {
                e.currentTarget.value = getDisplayPlaceholder();
            }
        }
        
        props.onFocus?.(e);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (maskPattern && clearMaskOnBlur) {
            const value = e.currentTarget.value;
            if (!isMaskComplete(value)) {
                e.currentTarget.value = '';
                if (inForm && name) setFieldValue?.(name, '');
            }
        }
        
        props.onBlur?.(e);
    }

    // If the store value changes externally, update the DOM value
    useEffect(() => {
        if (inputRef.current && name && formValue !== undefined) {
            const newValue = maskPattern && formValue ? applyMask(getRawValue(String(formValue))) : String(formValue);
            if (inputRef.current.value !== newValue) {
                inputRef.current.value = newValue;
            }
        }
    }, [formValue, name, maskPattern, applyMask, getRawValue]);

    useEffect(() => {
        return () => {
            if (inForm && name) deleteFieldValue?.(name);
        };
    }, [deleteFieldValue, inForm, name]);
  
    return <input
        name={name}
        className={`--input --${variant || themeVariant || Variant.Medium} ${error ? '--has-error' : ''} --flex ${className}`.trim()}
        style={style}
        {...(value === undefined ? { defaultValue: formValue ?? defaultValue ?? (maskPattern && showMaskOnFocus ? '' : "") } : { value })}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
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
