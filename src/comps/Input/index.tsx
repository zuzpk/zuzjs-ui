"use client"
import { useEffect, useMemo, useRef, useCallback } from 'react';
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
 * advanced input masking with pattern-based character validation. Mask edits (typing,
 * pasting, cutting, deleting forward/backward, replacing a selection) are handled via
 * the `beforeinput` event so they work correctly from any cursor position, not just
 * when appending at the end.
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
 * />
 * ```
 * 
 * @example
 * // Custom placeholder character shown on focus (default '_')
 * ```tsx
 * <Input 
 *   mask={{ mask: '00000-0000000-0', placeholderChar: '•' }} 
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
 * - Any other character = fixed separator (shown as literal, auto-inserted as you type)
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
        onKeyDown: onKeyDownProp,
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
    // Only a genuine custom skeleton (e.g. '___A-BB123') should be used positionally.
    // We must NOT fall back to `maskPattern` itself here — for a pattern like '0',
    // the pattern character IS a valid digit, so using it as "placeholder text"
    // would make the ghost text indistinguishable from real, validated input.
    const placeholderMask = mask?.placeholder;
    const placeholderChar = mask?.placeholderChar || '_';
    const showMaskOnFocus = mask?.showMaskOnFocus !== false;
    const clearMaskOnBlur = mask?.clearMaskOnBlur === true;
    const userPlaceholder = (rest as any)?.placeholder ?? '';

    // Index of every pattern-char slot in the mask, in order. This is the bridge
    // between "position in the displayed masked string" and "index into the
    // flat, separator-free raw value" — used for cursor mapping in every direction.
    const patternCharPositions = useMemo(() => {
        const positions: number[] = [];
        for (let i = 0; i < maskPattern.length; i++) {
            if (isPatternChar(maskPattern[i])) positions.push(i);
        }
        return positions;
    }, [maskPattern]);

    /**
     * Get display placeholder string (skeleton shown via the native `placeholder`
     * attribute — never injected into the actual value).
     */
    const getDisplayPlaceholder = useCallback((): string => {
        if (!maskPattern) return '';
        
        let result = '';
        for (let i = 0; i < maskPattern.length; i++) {
            const char = maskPattern[i];
            if (isPatternChar(char)) {
                result += placeholderMask?.[i] ?? placeholderChar;
            } else {
                result += char;
            }
        }
        return result;
    }, [maskPattern, placeholderMask, placeholderChar]);

    /**
     * Apply mask to a raw (unmasked, separator-free) value with validation,
     * auto-inserting any literal separator that immediately follows the last
     * accepted character.
     */
    const applyMask = useCallback((value: string): string => {
        if (!maskPattern) return value;

        let result = '';
        let valueIndex = 0;
        let i = 0;
        
        for (; i < maskPattern.length && valueIndex < value.length; i++) {
            const patternChar = maskPattern[i];
            
            if (isPatternChar(patternChar)) {
                const char = value[valueIndex];
                if (validateChar(char, patternChar)) {
                    result += char;
                    valueIndex++;
                } else {
                    // Invalid character — drop it and try the next input character
                    // against the same mask slot.
                    valueIndex++;
                    i--;
                }
            } else {
                result += patternChar;
            }
        }

        // Auto-insert any literal separator(s) immediately following the last
        // character typed so far, so '-' appears on its own instead of needing
        // to be typed manually.
        while (i < maskPattern.length && !isPatternChar(maskPattern[i])) {
            result += maskPattern[i];
            i++;
        }
        
        return result;
    }, [maskPattern]);

    /**
     * Extract the flat raw (separator-free) value from a masked string. Assumes
     * `value` is mask-aligned (i.e. produced by applyMask) — an invariant we now
     * maintain on every single edit (typed, pasted, deleted, from any cursor
     * position), not just append-at-the-end typing.
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

    /**
     * Map a cursor position in the masked (displayed) string to an index into
     * the flat raw value — "how many raw characters sit to the left of this
     * mask position". Well-defined for any position, including ones that land
     * on a separator.
     */
    const maskPositionToRawIndex = useCallback((maskPos: number): number => {
        let count = 0;
        for (let i = 0; i < maskPos && i < maskPattern.length; i++) {
            if (isPatternChar(maskPattern[i])) count++;
        }
        return count;
    }, [maskPattern]);

    /**
     * Simulate applyMask's own accept/reject logic locally, just to count how
     * many characters of a candidate insertion (`data`) would actually survive
     * once mask validation runs, starting from raw index `startRawIndex`. Used
     * purely to compute where the caret should land after the real applyMask
     * call — this must mirror applyMask's rules exactly.
     */
    const countAcceptedFromData = useCallback((data: string, startRawIndex: number): number => {
        let slot = startRawIndex < patternCharPositions.length
            ? patternCharPositions[startRawIndex]
            : maskPattern.length;
        let accepted = 0;
        let di = 0;
        while (slot < maskPattern.length && di < data.length) {
            const patternChar = maskPattern[slot];
            if (isPatternChar(patternChar)) {
                if (validateChar(data[di], patternChar)) {
                    accepted++;
                    slot++;
                }
                di++;
            } else {
                slot++;
            }
        }
        return accepted;
    }, [maskPattern, patternCharPositions]);

    const handleInput = (event: React.InputEvent<HTMLInputElement>) => {

        let val = event.currentTarget.value;
        
        if (numeric) {
            val = val.replace(/[^0-9.]/g, '').replace(/(\..{0,}?)\..*/, '$1');
            event.currentTarget.value = val;
        } else if (maskPattern) {
            // Normal fallback path: re-derive from whatever the DOM currently
            // holds and re-normalize. For real edits this is now driven (and
            // pre-applied) by handleBeforeInput below, which dispatches a
            // synthetic 'input' event that lands here just to do bookkeeping
            // (setFieldValue / onInput) — applyMask on an already-canonical
            // string is a harmless no-op. This also remains the sole path for
            // IME composition, where we deliberately don't intercept beforeinput.
            const rawValue = getRawValue(val);
            const maskedValue = applyMask(rawValue);
            event.currentTarget.value = maskedValue;
            val = maskedValue;
        }

        if (inForm && name) setFieldValue?.(name, val);

        props.onInput?.(event);

    }

    /**
     * The core of mid-edit / paste robustness. `beforeinput` fires before the
     * browser mutates the DOM value and tells us exactly what edit is being
     * attempted (insert vs. delete, forward vs. backward, and the selection it
     * applies to). We take full manual control: compute the edit purely in
     * terms of the flat raw value, reapply the mask, and place the caret.
     */
    const handleBeforeInput = (event: React.FormEvent<HTMLInputElement>) => {
        if (!maskPattern || numeric) return;

        const input = inputRef.current;
        if (!input) return;

        const native = event.nativeEvent as unknown as InputEvent;

        // Don't fight an IME composition session — let it finish natively and
        // fall back to handleInput's re-normalization afterward.
        if ((native as any).isComposing) return;

        const inputType = native.inputType;
        const data = native.data ?? (native as any).dataTransfer?.getData?.('text/plain') ?? '';

        const selStart = input.selectionStart ?? input.value.length;
        const selEnd = input.selectionEnd ?? selStart;

        // From here on we own the edit entirely.
        event.preventDefault();

        const rawValueBefore = getRawValue(input.value);
        const rawStart = maskPositionToRawIndex(selStart);
        const rawEnd = maskPositionToRawIndex(selEnd);

        let newRaw: string;
        let newRawCursorIndex: number;

        if (inputType?.startsWith('delete')) {
            if (rawStart !== rawEnd) {
                // A real selection was being deleted/replaced with nothing.
                newRaw = rawValueBefore.slice(0, rawStart) + rawValueBefore.slice(rawEnd);
                newRawCursorIndex = rawStart;
            } else if (inputType === 'deleteContentForward') {
                // Delete key: remove the raw char at (to the right of) the caret.
                newRaw = rawValueBefore.slice(0, rawStart) + rawValueBefore.slice(rawStart + 1);
                newRawCursorIndex = rawStart;
            } else {
                // Backspace (deleteContentBackward and friends): remove the raw
                // char to the left of the caret.
                if (rawStart === 0) {
                    newRaw = rawValueBefore;
                    newRawCursorIndex = 0;
                } else {
                    newRaw = rawValueBefore.slice(0, rawStart - 1) + rawValueBefore.slice(rawStart);
                    newRawCursorIndex = rawStart - 1;
                }
            }
        } else if (data) {
            // Typing, paste, drop, autofill, etc. First drop any selected
            // range, then splice the new characters in at that point.
            const withoutSelection = rawValueBefore.slice(0, rawStart) + rawValueBefore.slice(rawEnd);
            newRaw = withoutSelection.slice(0, rawStart) + data + withoutSelection.slice(rawStart);
            newRawCursorIndex = rawStart + countAcceptedFromData(data, rawStart);
        } else {
            // Nothing to insert and not a delete — no-op edit, ignore.
            return;
        }

        const newMasked = applyMask(newRaw);
        input.value = newMasked;

        const clampedRawIndex = Math.max(0, Math.min(newRawCursorIndex, patternCharPositions.length));
        const caretPos = clampedRawIndex < patternCharPositions.length
            ? Math.min(patternCharPositions[clampedRawIndex], newMasked.length)
            : newMasked.length;

        input.setSelectionRange(caretPos, caretPos);

        // Let the normal input pipeline (setFieldValue / props.onInput) run
        // through the single existing codepath instead of duplicating it here.
        input.dispatchEvent(new Event('input', { bubbles: true }));
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Deletion (Backspace/Delete) for masked inputs is now fully handled
        // in handleBeforeInput, including selection ranges and forward delete.
        onKeyDownProp?.(e);
        if (e.defaultPrevented) return;
        if (e.key === 'Enter') {
            onConfirm?.(e.currentTarget.value);
        }
    }

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        if (maskPattern && showMaskOnFocus && !e.currentTarget.value) {
            // Native placeholder attribute only — ghost text, never selectable,
            // never confused with a real (validated) value.
            e.currentTarget.placeholder = getDisplayPlaceholder();
        }
        
        props.onFocus?.(e);
    }

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const input = e.currentTarget;

        if (maskPattern) {
            if (clearMaskOnBlur && !isMaskComplete(input.value)) {
                input.value = '';
                if (inForm && name) setFieldValue?.(name, '');
            }
            if (showMaskOnFocus && !input.value) {
                input.placeholder = userPlaceholder;
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
        {...(value === undefined ? { defaultValue: formValue ?? defaultValue ?? '' } : { value })}
        onBeforeInput={handleBeforeInput}
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