"use client"
import React from 'react';
import { useBase } from '../../hooks';
import { BoxProps, Status, TRANSITION_CURVES, TRANSITIONS, ValueOf } from '../../types';
import Box from '../Box';
import Spinner from '../Spinner';

export type BadgeProps = BoxProps & {
    size?: number,
    type?: ValueOf<typeof Status>,
    label?: string,
    loading?: boolean
}

const Badge : React.FC<BadgeProps> = ({ 
    size = 5, 
    type = `dead`,
    label = ``,
    loading = false,
    ...pops
}) => {
    
    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)

    return <Box 
        style={{
            width: `${size+4}px`,
            height: `${size+4}px`,
            ...style
        }} 
        as={`--badge rel flex aic jcc ${className}`.trim()}>
        <Box 
            fx={{
                transition: TRANSITIONS.FadeIn,
                curve: TRANSITION_CURVES.Liquid,
                duration: 0.5,
                when: loading
            }}
            as={`abs abc`}><Spinner /></Box>
        <Box style={{
            width: `${size}px`,
            height: `${size}px`,
        }} as={`--dot --${type}`} />
    </Box>
}

export default Badge;