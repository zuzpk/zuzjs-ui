import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';

export type LabelProps = Props<`label`> & {}

/**
 * Label component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Label>Username</Label>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Label required={true} error="Username is required">Username</Label>
 * ```
 * @param required - required prop
 * @param error - error prop
 */
const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {

    const {
        style,
        className,
        rest
    } = useBase<"label">(props)
 
    return <label
        ref={ref}
        style={style}
        className={className}
        {...rest} />

})

Label.displayName = `Zuz.Label`

export default Label