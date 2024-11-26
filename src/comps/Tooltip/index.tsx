"use client"
import { createElement, forwardRef, HTMLAttributes, ReactNode, useMemo, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Span from '../Span';
import Box, { BoxProps } from '../Box';
import Text from '../Text';
import { TRANSITION_CURVES, TRANSITIONS } from '../../types/enums';
import { TOOLTIP, ToolTipProps } from './types';

const ToolTip = forwardRef<HTMLDivElement, ToolTipProps>((props, ref) => {

    const { title, dir, children, ...pops } = props
    const {
        style,
        className,
        rest
    } = useBase(pops)
    const [ hovered, setHovered ] = useState(false)
    const dx = useMemo(() => dir || TOOLTIP.Bottom, [])
 
    return <Box 
        className={`--with-tooltip rel`}
        onMouseEnter={e => setHovered(true)}
        onMouseLeave={e => setHovered(false)}>
        <Box 
            className={`--tooltip --${dir || TOOLTIP.Top} abs ${className}`.trim()}
            animate={{
                from: dx == TOOLTIP.Bottom || dx == TOOLTIP.Top ? 
                    { opacity: 0, x: `-50%`, y: dx == TOOLTIP.Top ? -5 : 5 } 
                    : { opacity: 0, y: `-50%`, x: dx == TOOLTIP.Right ? `60%` : `-60%` },
                to: dx == TOOLTIP.Bottom || dx == TOOLTIP.Top ? 
                    { opacity: 1, x: `-50%`, y: 0 } 
                    : { opacity: 1, y: `-50%`, x: dx == TOOLTIP.Right ? `55%` : `-55%` },
                curve: TRANSITION_CURVES.EaseInOut,
                when: hovered
            }}>
            <Text className={`--text rel`}>{title}</Text>
        </Box>
        {children}
    </Box>

})

export default ToolTip