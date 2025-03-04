"use client"
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Size, SPINNER } from '../../types/enums';
import Icon from '../Icon';
import Span from '../Span';
import Spinner from '../Spinner';
import { ButtonProps, ButtonState } from './types';

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

    const { reset, size, variant, icon, iconSize, children, withLabel, spinner, state, disabled, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    
    return <button
        className={`--button ${variant ? `--${variant}` : ``} ${size ? `--${size}` : ``} flex aic ${!reset ? `jcc` : ``} ${icon ? `ico-btn` : ``} ${className}`.trim().replace(/\s+/g, ' ')}
        style={style}
        ref={ref}
        disabled={state == ButtonState.Loading || props.skeleton?.enabled || disabled}
        {...rest}>
        
        { state == ButtonState.Loading && <Spinner size={Size.Small} type={spinner || SPINNER.Simple} />}

        { ( !state || state == ButtonState.Normal ) && <>
            {icon && <Icon
                size={iconSize}
                name={icon} />}

            {withLabel === true ? <Span>{children}</Span> : children}
        </>}

    </button>
})

Button.displayName = `Button`

export default Button