import { useCommandActions, useDebounce } from '@zuzjs/hooks';
import { Ref, useCallback, useEffect, useRef } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types/enums';
import Box from '../Box';
import { useForm } from '../Form/context';
import CommandBox from "./commands";
import { TextAreaProps } from "./types";

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

  const form = useForm()
  const error = name ? form.errors?.[name] : null
  const inForm = name && form.values && form.setFieldValue
  const formValue = inForm ? form.values?.[name] : undefined;

  const updateFieldValue = useDebounce((val) => {
        if (inForm) {
            form.setFieldValue?.(name, val);
        }
    }, 500)

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
        if (inForm) form.deleteFieldValue?.(name);
    };
  }, []);

  return (
    <Box as="rel">
      <textarea
        name={name}
        className={`--input --textarea --${variant || themeVariant || Variant.Medium} flex ${className}`.trim()}
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