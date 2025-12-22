import { forwardRef, useCallback, useEffect, useRef } from 'react';
import { Box, useCommandActions } from "../..";
import { useBase } from '../../hooks';
import { Variant } from '../../types/enums';
import CommandBox from "./commands";
import { TextAreaProps } from "./types";

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>((props, ref) => {
  const {
    autoResize,
    maxHeight,
    variant = Variant.Small,
    resize = 'none',
    command,
    commands,
    onInput,
    cmd,
    renderDropdown,
    value: controlledValue,
    defaultValue,
    ...pops
  } = props;

  const innerRef = useRef<HTMLTextAreaElement>(null);
  const frameRef = useRef<number | null>(null);

  const { style, className, rest } = useBase<"textarea">(pops);

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

  // ------------------------------------------------------------------
  // Resize function (no state → direct DOM update)
  // ------------------------------------------------------------------
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

  // ------------------------------------------------------------------
  // Input handler
  // ------------------------------------------------------------------
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    onInput?.(e);
    handleCommandInput(e);
    resizeTextArea();
  };

  // ------------------------------------------------------------------
  // Initial resize + controlled value change
  // ------------------------------------------------------------------
  useEffect(() => {
    resizeTextArea();
  }, [controlledValue, defaultValue, resizeTextArea]);

  // ------------------------------------------------------------------
  // Resize on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (autoResize && innerRef.current) {
      resizeTextArea();
    }
  }, [autoResize, resizeTextArea]);

  // ------------------------------------------------------------------
  // Cleanup
  // ------------------------------------------------------------------
  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <Box as="rel">
      <textarea
        className={`--input --textarea --${variant} flex ${className}`.trim()}
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
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
          innerRef.current = node;
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
});

TextArea.displayName = 'Zuz.TextArea';

export default TextArea;