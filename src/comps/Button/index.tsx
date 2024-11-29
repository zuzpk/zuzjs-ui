"use client"
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';
import { ButtonHandler, ButtonProps, ButtonState } from './types';
import Spinner from '../Spinner';
import { Size } from '../../types/enums';

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

    const { icon, iconSize, children, withLabel, spinner, state, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    
    return <button
        className={`${className} flex aic jcc ${icon ? `ico-btn` : ``}`}
        style={style}
        ref={ref}
        {...rest}>
        
        { state == ButtonState.Loading && <Spinner 
            size={Size.Small} 
            {...{
                color: `#ffffff`,
                ...(spinner || {})
            }} />}

        { ( !state || state == ButtonState.Normal ) && <>
            {icon && <Icon
                size={iconSize}
                name={icon} />}

            {withLabel === true ? <Span>{children}</Span> : children}
        </>}

    </button>
})

export default Button