import { Ref } from 'react';
import { Props, ValueOf, Variant, WithFormValidation } from '../../types';

/**
 * Pattern characters for mask validation:
 * - `0` - numeric (0-9)
 * - `A` - alphabetic (a-z, A-Z)
 * - `Z` - alphanumeric (a-z, A-Z, 0-9)
 * - `S` - special characters or any character
 * - Any other character is treated as a fixed separator
 */
export type InputMaskOptions = {
    /**
     * Mask pattern with validation:
     * - Use `0` for numeric characters (0-9)
     * - Use `A` for alphabetic characters (a-z, A-Z)
     * - Use `Z` for alphanumeric characters (a-z, A-Z, 0-9)
     * - Use `S` for any character (no validation)
     * - Use any other character as fixed separator
     * 
     * Example: '000A-BB123-BBBB9'
     * - First 3 digits must be numeric
     * - Next character must be alphabetic
     * - Next 2 characters must be alphabetic
     * - Next 3 digits must be numeric
     * - etc.
     */
    mask?: string;
    /**
     * Character to use as placeholder for validation (default: shows the pattern char)
     */
    placeholderChar?: string;
    /**
     * Whether to show mask on focus (default: true)
     */
    showMaskOnFocus?: boolean;
    /**
     * Whether to clear mask on blur when empty (default: false)
     */
    clearMaskOnBlur?: boolean;
    /**
     * Custom placeholder mask to display (if different from validation mask)
     * Example: mask='000A-BB123' placeholder='___A-BB123'
     */
    placeholder?: string;
}

export type InputProps = Props<`input`> & {
    ref?: Ref<HTMLInputElement>,
    numeric?: boolean,
    variant?: ValueOf<typeof Variant>,
    with?: WithFormValidation,
    /**
     * Triggers when Enter / Return is Pressed
     */
    onConfirm?: (value: string) => void,
    /**
     * Mask options for input formatting
     */
    mask?: InputMaskOptions,
}
