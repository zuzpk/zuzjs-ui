import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { forwardRef, ComponentPropsWithoutRef } from 'react';
import With, { animationProps } from "./base";

export interface WheelProps { 
  as?: string, direction?: `up` | `down`, 
  value?: number | string, 
  color?: string, animate?: animationProps 
}

export interface WheelHandler {
  setValue: ( v: number | string ) => void,
  updateValue: ( v: number | string ) => void,
}

const TextWheel = forwardRef<WheelHandler, WheelProps>((props, ref) => {

    const { as, value, color, direction, ...rest } = props
    const divRef = useRef<HTMLDivElement>(null);
    
    const [ _value, _setValue ] = useState(value || 0);

    useImperativeHandle(ref, () => ({
      updateValue(v){
        // console.log(_value != v, _value.toString().length != v.toString().length)
        if ( _value.toString().length != v.toString().length ) {
          _setValue(v);
        }
      },
      setValue(v){
        this.updateValue(v);
        if (divRef.current) {
          const chars = v.toString().split('');
          divRef.current.querySelectorAll('.wheel-char').forEach((charElement, index) => {
            const char = chars[index];
            if (charElement instanceof HTMLElement) {
              charElement.setAttribute('data-value', char);
              const track = charElement.querySelector('.wheel-char-track');
              if (track instanceof HTMLElement) {
                track.style.setProperty('--v', char);
              }
            }
          });
        }
      }
    }))

    useEffect(() => {
      // console.log(value)
      _setValue(value || 0);
    }, [value])

    return <With 
      className={`text-wheel flex aic jcc rel`} aria-hidden={true}
      as={as} 
      ref={divRef}
      {...rest} >
        {(_value||0).toString().split('').map((char, index) => {
          if ( isNaN(parseInt(char, 10))){
            return <With tag={`span`} key={`wheel-char-${index}`} className="wheel-char wheel-char-symbol grid">{char}</With>
          }
          return <With tag={`span`} key={`wheel-char-${index}`} 
            data-value={char} 
            className={`wheel-char grid ${index > char.toString().split('').length - 3 ? 'wheel-fraction' : ''}`.trim()}>
              <With tag={`span`} className={`wheel-char-track wheel-track-${direction || `down`} grid`} style={{ 
                '--v': char
              } as React.CSSProperties}>
                <With tag={`span`}>{!direction || direction == `down` ? 0 : 9}</With>
                {(
                  !direction || direction == `down` ? 
                    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
                    : [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
                ).map((val, indx) => {
                  return <With tag={`span`} key={`${index}--${indx}`}>{val}</With>
                })}
                <With tag={`span`}>{!direction || direction == `down` ? 9 : 0}</With>
              </With>
            </With>
        })}
        {color && <With className={`abs fillx`} style={{
          zIndex: 1,
          background: `linear-gradient(0deg, ${color}, transparent, transparent, transparent, ${color})`,
        }} />}
    </With>
    
})

export default TextWheel;