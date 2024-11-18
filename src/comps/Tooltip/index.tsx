"use client"
import { createElement, forwardRef, HTMLAttributes, ReactNode, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Span from '../Span';
import Box, { BoxProps } from '../Box';
import Text from '../Text';
import { TRANSITION_CURVES, TRANSITIONS } from '../../types/enums';

export type ToolTipProps = BoxProps & {
    
}

const ToolTip = forwardRef<HTMLDivElement, ToolTipProps>((props, ref) => {

    const { title, children, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase(pops)
    const [ hovered, setHovered ] = useState(false)
 
    return <Box 
        className={`--with-tooltip rel`}
        onMouseEnter={e => setHovered(true)}
        onMouseLeave={e => setHovered(false)}>
        <Box 
            className={`--tooltip abs ${className}`.trim()}
            animate={{
                from: { opacity: 0, x: `-50%`, y: -5 },
                to: { opacity: 1, x: `-50%`, y: 0 },
                curve: TRANSITION_CURVES.EaseInOut,
                when: hovered
            }}>
            <Text className={`--text rel`}>{title}</Text>
        </Box>
        {children}
    </Box>

})

export default ToolTip