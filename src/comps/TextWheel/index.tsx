"use client"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Box from '../Box';
import Span from '../Span';
import { TextWheelHandler, TextWheelProps } from './types';

/**
 * TextWheel component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TextWheel items={["Option 1", "Option 2", "Option 3"]} onChange={(selected) => console.log(selected)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <TextWheel items={[{ label: "Red", value: "red" }, { label: "Blue", value: "blue" }]} onChange={(val) => console.log(val)} />
 * ```
 * @param items - Array of items
 * @param onChange - Callback function triggered when value changes
 */
const TextWheel = forwardRef<TextWheelHandler, TextWheelProps>((props, ref) => {

    const { as, value, color, direction, ...rest } = props
    const divRef = useRef<HTMLDivElement>(null);
    
    // Internal state to manage the displayed value
    const [ _value, _setValue ] = useState(value || 0);

    // Expose methods to parent components via ref
    useImperativeHandle(ref, () => ({
      // Updates the value without immediately triggering a full re-render of characters
      // Useful for when the number of digits changes.
      updateValue(v){
        if ( _value.toString().length !== v.toString().length ) {
          _setValue(v);
        }
      },
      // Sets the value and triggers the animation for each character
      setValue(v){
        this.updateValue(v); // First, update the internal value to handle length changes
        if (divRef.current) {
          const chars = v.toString().split('');
          divRef.current.querySelectorAll('.--wheel-char').forEach((charElement, index) => {
            const char = chars[index];
            if (charElement instanceof HTMLElement) {
              // Set the data-value attribute, which CSS can then use
              charElement.setAttribute('data-value', char);
              const track = charElement.querySelector('.--wheel-char-track');
              if (track instanceof HTMLElement) {
                // Directly update the CSS custom property for immediate animation
                track.style.setProperty('--v', char);
                // Force a reflow to ensure the transition plays even if the value is the same
                // This is a common trick for re-triggering CSS animations/transitions
                void track.offsetWidth; 
              }
            }
          });
        }
      }
    }))

    // Effect to update internal value when the prop `value` changes
    useEffect(() => {
      _setValue(value || 0);
    }, [value])

    return (
      <Box
        className={`--text-wheel flex aic rel`} 
        aria-hidden={true} // Good for accessibility if this is purely decorative
        as={as} 
        ref={divRef}
        {...rest}
      >
        {(_value || 0).toString().split('').map((char, index) => {
          // Render non-numeric characters directly (e.g., decimal points)
          if ( isNaN(parseInt(char, 10))){
            return <Span key={`wheel-char-symbol-${index}`} className="--wheel-char wheel-char-symbol grid">{char}</Span>
          }
          // Render numeric characters with the wheel effect
          return (
            <Span 
              key={`wheel-char-${index}`} 
              data-value={char} 
              className={`--wheel-char grid ${index > (_value || 0).toString().length - 3 ? '--wheel-fraction' : ''}`.trim()}
            >
              <Span 
                className={`--wheel-char-track --wheel-track-${direction || `down`} grid`} 
                style={{ 
                    '--v': char // Set the custom property for the current character value
                } as React.CSSProperties} // Type assertion for custom properties
              >
                {/* Initial and final values to ensure smooth loop for animation */}
                <Span>{!direction || direction === `down` ? 0 : 9}</Span>
                {(
                  !direction || direction === `down` ? 
                    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
                    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                ).map((val, indx) => {
                  return <Span key={`${index}--${indx}`}>{val}</Span>
                })}
                <Span>{!direction || direction === `down` ? 9 : 0}</Span>
              </Span>
            </Span>
          )
        })}
        {/* Optional overlay for gradient effect */}
        {color && <Box className={`abs fillx`} style={{
          zIndex: 1,
          background: `linear-gradient(0deg, ${color}, transparent, transparent, transparent, ${color})`,
        }} />}
      </Box>
    );
})

TextWheel.displayName = `Zuz.TextWheel`

export default TextWheel;