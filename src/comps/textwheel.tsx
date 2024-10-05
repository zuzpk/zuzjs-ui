import React from 'react';
import Heading from './heading';
import { forwardRef, ComponentPropsWithoutRef } from 'react';
import With, { animationProps } from "./base";

const TextWheel = forwardRef<HTMLDivElement, { as?: string, direction?: `up` | `down`, value: number | string, color?: string, animate?: animationProps }  & ComponentPropsWithoutRef<`div`>>((props, ref) => {

    const { as, value, color, direction, ...rest } = props

    return <With 
      className={`text-wheel flex aic rel`} aria-hidden={true}
      as={as} 
      ref={ref}
      {...rest} >
        {value.toString().split('').map((char, index) => {
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
        {color && <With className={`abs fill`} style={{
          zIndex: 1,
          background: `linear-gradient(0deg, ${color}, transparent, transparent, transparent, ${color})`,
        }} />}
    </With>
    
})

export default TextWheel;
// const TextWheel = forwardRef<HTMLDivElement, { as?: string, value: number | string, animate?: animationProps }  & ComponentPropsWithoutRef<`div`>>((props, ref) => {

//     const { as, value, ...rest } = props

//     const padCount = 0
//     const paddedValue = value.toString().padStart(value.toString().length + padCount, '1') 

//     return <With 
//         className={`text-wheel flex aic`} aria-hidden={true}
//         as={as} 
//         ref={ref}
//         {...rest} >
//             {value.toString().split('').map((char, index) => {
//                 if ( isNaN(parseInt(char, 10))){
//                     return <With tag={`span`} key={index} className="text-wheel-char text-wheel-char-symbol">{char}</With>
//                 }
//                 return <With key={`text-wheel-chars-${index}`} tag={`span`} data-value={char} className={`text-wheel-char ${index > char.toString().split('').length - 3 ? 'text-wheel-fraction' : ''}`}>
//                   <With tag={`span`} className="text-wheel-char-track" style={{ '--v': char } as React.CSSProperties}>
//                     <With tag={`span`}>9</With>
//                     {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((val, indx) => {
//                       return <With tag={`span`} key={`${index}--${indx}`}>{val}</With>
//                     })}
//                     <With tag={`span`}>0</With>
//                   </With>
//                 </With>
//             })}
//         </With>
    
// })

// export default TextWheel;