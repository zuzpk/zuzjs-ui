"use client"
import { forwardRef, Ref, useImperativeHandle, useRef, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';
import { ButtonHandler, ButtonProps, ButtonState } from './types';
import Spinner from '../Spinner';
import { Size } from '../../types/enums';

const Button = forwardRef((props : ButtonProps, ref) => {

    const { icon, iconSize, children, withLabel, spinner, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    const [ loading, setLoading ] = useState(false)

    useImperativeHandle(ref, () => ({
        setState: (mod : ButtonState) => {
            if ( mod == ButtonState.Loading ){
                setLoading(true)
            }
            else if ( mod == ButtonState.Normal ){
                setLoading(false)
            }
        },
        reset: () => {
            setLoading(false)
        }
    }) as ButtonHandler)
 
    return <button
        className={`${className} flex aic jcc ${icon ? `ico-btn` : ``}`}
        style={style}
        ref={ref as Ref<HTMLButtonElement>}
        {...rest}>
        
        { loading && <Spinner 
            size={Size.Small} 
            {...{
                color: `#ffffff`,
                ...(spinner || {})
            }} />}
        {!loading && icon && <Icon
            size={iconSize}
            name={icon} />}

        {withLabel === true ? <Span>{children}</Span> : children}

    </button>
})

export default Button