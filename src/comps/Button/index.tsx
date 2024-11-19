"use client"
import { forwardRef } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';

export type ButtonProps = Props<`button`> & {
    icon?: string,
    withLabel?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {

    const { icon, children, withLabel, ...pops } = props

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
        
        {icon && <Icon 
            name={icon} />}

        {withLabel === true ? <Span>{children}</Span> : children}

    </button>
})

export default Button