import { useCommandActions } from '@zuzjs/hooks';
import { Ref, useCallback, useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types/enums';
import Box from '../Box';
import { useFormActions, useFormFieldError, useFormFieldValue } from '../Form/context';
import CommandBox from "./commands";
import { TextAreaProps } from "./types";

/**
 * TextArea component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TextArea placeholder="Enter message..." onChange={(e) => console.log(e.target.value)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TextArea placeholder="Description..." rows={5} maxLength={500} onChange={(e) => console.log(e.target.value)} />
 * ```
 * @param placeholder - Placeholder text
 * @param onChange - Callback function triggered when value changes
 * @param rows - Array of row data
 * @param maxLength - maxLength prop
 */
const TextArea = ({
  ref,
  ...props
} : TextAreaProps & {
  ref?: Ref<HTMLTextAreaElement>
}) => {
  const {
    autoResize,
    maxHeight,
    variant,
    resize = 'none',
    command,
    commands,
    name,
    onInput,
    cmd,
    renderDropdown,
    value: controlledValue,
    defaultValue,
    ...pops
  } = props;

  const innerRef = useRef<HTMLTextAreaElement>(null);
  const frameRef = useRef<number | null>(null);
  const { variant: themeVariant } = useTheme(true)!
  const { style, className, rest } = useBase<"textarea">(pops);

    const form = useFormActions()
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
    const setFieldValue = form?.setFieldValue
    const deleteFieldValue = form?.deleteFieldValue
    const inForm = Boolean(name && setFieldValue)

  const updateFieldValue = (val: string) => {
      if (inForm && name) setFieldValue?.(name, val);
    }

  const {
    showDropdown,
    dropdownPosition,
    handleKeyDown,
    handleInput: handleCommandInput,
    handleCommandSelect,
  } = useCommandActions({
    command,
    commands,
    cmd,
    ref: innerRef,
  });

  // Resize function (no state → direct DOM update)
  const resizeTextArea = useCallback(() => {
    const textarea = innerRef.current;
    if (!textarea || !autoResize) return;

    // Cancel previous frame
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
    }

    // Schedule resize after paint
    frameRef.current = requestAnimationFrame(() => {
      textarea.style.height = 'auto';
      let newHeight = textarea.scrollHeight;

      if (maxHeight) {
        const max = parseInt(maxHeight.toString(), 10);
        if (!isNaN(max)) {
          newHeight = Math.min(newHeight, max);
        }
      }

      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY = maxHeight && newHeight >= parseInt(maxHeight.toString(), 10) ? 'auto' : 'hidden';
    });
  }, [autoResize, maxHeight]);

  // Input handler
  const handleInput = (e: React.InputEvent<HTMLTextAreaElement>) => {
    updateFieldValue(e.currentTarget.value)
    onInput?.(e);
    handleCommandInput(e);
    resizeTextArea();
  };

  useEffect(() => {
      if (innerRef.current && name && formValue !== undefined) {
          if (innerRef.current.value !== String(formValue)) {
              innerRef.current.value = String(formValue);
          }
      }
  }, [formValue, name]);

  // Initial resize + controlled value change
  useEffect(() => {
    resizeTextArea();
  }, [controlledValue, defaultValue, resizeTextArea]);

  // Resize on mount
  useEffect(() => {
    if (autoResize && innerRef.current) {
      resizeTextArea();
    }
  }, [autoResize, resizeTextArea]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    return () => {
        if (inForm && name) deleteFieldValue?.(name);
    };
  }, [deleteFieldValue, inForm, name]);

  return (
    <Box as="rel --flex w-full">
      <textarea
        name={name}
        className={`--input --no-focus --textarea --${variant || themeVariant || Variant.Medium} flex ${className}`.trim()}
        style={{
          ...style,
          resize,
          height: autoResize ? 'auto' : style?.height,
          overflow: 'hidden', // Always hidden unless maxHeight hit
          transition: autoResize ? 'none' : undefined, // Remove transition flicker
        }}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        ref={(node) => {
          innerRef.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        value={controlledValue}
        defaultValue={defaultValue}
        {...rest}
      />

      {/* Command Dropdown */}
      {renderDropdown ? (
        renderDropdown({
          show: showDropdown,
          position: dropdownPosition,
          commands: commands || [],
          onSelect: handleCommandSelect,
        })
      ) : (
        commands && commands.length > 0 && (
          <CommandBox
            visible={showDropdown}
            commands={commands}
            onSelect={handleCommandSelect}
            position={dropdownPosition}
          />
        )
      )}
    </Box>
  );
}

TextArea.displayName = 'Zuz.TextArea';

export default TextArea;