"use client"
import { removeDuplicateWords } from '@zuzjs/core';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import Icon from '../Icon';
import Span from '../Span';
import Spinner from '../Spinner';
import { SPINNER } from '../Spinner/types';
import ToolTip from '../Tooltip';
import { ButtonProps, ButtonState } from './types';

/**
 * Button component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Button onClick={() => console.log("clicked")}>Click me</Button>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Button kind="solid" variant="primary" icon="check" state="loading" spinner="simple">Save Changes</Button>
 * ```
 * @param onClick - Callback function triggered on click
 * @param kind - kind prop
 * @param variant - Visual variant or style
 * @param icon - Icon identifier
 * @param state - state prop
 * @param spinner - spinner prop
 */
const Button = ({ ref, ...props} : ButtonProps) => {

    const { 
        reset, 
        kind = `solid`,
        variant, 
        tooltip,
        tooltipProps,
        alignment = `center`,
        icon, iconSize, children, withLabel, spinner, state, disabled, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase<"button">(pops)
    const { variant: themeVariant } = useTheme(true)!
    
    const _alignment = alignment === `start` ? `--jcs` : alignment === `end` ? `--jce` : `--jcc`

    const _button = <button
        className={removeDuplicateWords(`--button ${tooltip ? `--tooltip-anchor` : ``} --${kind} --${variant || themeVariant} --flex --aic ${!reset ? _alignment : ``} ${icon ? `--with-icon` : ``} --no-shrink ${className}`).trim().replace(/\s+/g, ' ')}
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

    return tooltip ? <ToolTip title={tooltip} {...tooltipProps}>{_button}</ToolTip> : _button;
}

Button.displayName = `Zuz.Button`

export default Button