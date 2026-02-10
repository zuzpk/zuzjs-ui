"use client"
import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import Icon from '../Icon';
import Span from '../Span';
import Spinner from '../Spinner';
import { ButtonProps, ButtonState } from './types';
import { Variant } from '../../types/enums';
import { SPINNER } from '../Spinner/types';
import { useTheme } from '../../hooks/useColorScheme';

const Button = ({ ref, ...props} : ButtonProps) => {

    const { 
        reset, 
        variant, 
        icon, iconSize, children, withLabel, spinner, state, disabled, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    const { variant: themeVariant } = useTheme(true)!
    
    return <button
        className={`--button --${variant || themeVariant} flex aic ${!reset ? `jcc` : ``} ${icon ? `ico-btn` : ``} ${className}`.trim().replace(/\s+/g, ' ')}
        style={style}
        ref={ref}
        disabled={state == ButtonState.Loading || props.skeleton?.enabled || disabled}
        {...rest}>
        
        { state == ButtonState.Loading && <Spinner variant={variant || themeVariant} type={spinner || SPINNER.Simple} />}

        { ( !state || state == ButtonState.Normal ) && <>
            {icon && <Icon
                variant={iconSize}
                name={icon} />}

            {withLabel === true ? <Span>{children}</Span> : children}
        </>}

    </button>
}

Button.displayName = `Zuz.Button`

export default Button