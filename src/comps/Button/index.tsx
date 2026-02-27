"use client"
import { removeDuplicateWords } from '@zuzjs/core';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import Icon from '../Icon';
import Span from '../Span';
import Spinner from '../Spinner';
import { SPINNER } from '../Spinner/types';
import { ButtonProps, ButtonState } from './types';

const Button = ({ ref, ...props} : ButtonProps) => {

    const { 
        reset, 
        kind = `solid`,
        variant, 
        icon, iconSize, children, withLabel, spinner, state, disabled, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    const { variant: themeVariant } = useTheme(true)!
    
    return <button
        className={removeDuplicateWords(`--button --${kind} --${variant || themeVariant} flex aic ${!reset ? `jcc` : ``} ${icon ? `--with-icon` : ``} ${className}`).trim().replace(/\s+/g, ' ')}
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