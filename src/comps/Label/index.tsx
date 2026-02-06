import { forwardRef } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';

export type LabelProps = Props<`label`> & {}

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