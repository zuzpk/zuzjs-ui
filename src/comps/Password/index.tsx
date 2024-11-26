"use client"
import { forwardRef, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';
import Input, { InputProps } from '../Input';
import Box, { BoxProps } from '../Box';
import Button from '../Button';
import SVGIcons from '../svgicons';

export type PasswordProps = Omit<InputProps, `type` | `numeric`> & {}

const Password = forwardRef<HTMLInputElement, PasswordProps>((props, ref) => {

    const { ...pops } = props

    if ( `type` in pops ){
        delete pops[`type`]
    }

    const {
        style,
        className,
        rest
    } = useBase(pops)

    const [ visible, setVisible ] = useState(false)
 
    return <Box 
        style={style}
        className={`--password flex aic rel`}>
        <Input 
            ref={ref}
            type={visible ? 'text' : 'password'}
            className={className}
            {...rest as InputProps} />
        <Button 
            tabIndex={-1}
            onClick={() => setVisible(prev => !prev)}
            className={`--toggle flex aic jcc abs`}>
            {visible ? SVGIcons.eye : SVGIcons.eyeSlash}
        </Button>
    </Box>
        
})

export default Password