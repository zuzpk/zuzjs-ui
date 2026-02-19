"use client"
import { _ } from '@zuzjs/core';
import React from 'react';
import { useBase } from '../../hooks';
import { BoxProps, Status, TRANSITION_CURVES, TRANSITIONS, ValueOf, Variant } from '../../types';
import Box from '../Box';
import Spinner from '../Spinner';
import { SPINNER } from '../Spinner/types';
import Text from '../Text';

export type BadgeProps = BoxProps & {
    size?: number,
    type?: ValueOf<typeof Status>,
    variant?: ValueOf<typeof Variant>,
    label?: string,
    loading?: boolean,
    spinner?: ValueOf<typeof SPINNER>,
}

const Badge : React.FC<BadgeProps> = ({ 
    size = 5, 
    type = `dead`,
    label = ``,
    variant = Variant.Small,
    loading = false,
    spinner,
    ...pops
}) => {
    
    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)

    return <Box 
        style={{
            ...(_(label).isEmpty() ? { 
                "--badge-size": size
            } : {}),
            ...style
        }} 
        as={`--badge --${variant} --${type} rel flex aic jcc ${className}`.trim()}>
        <Box 
            fx={{
                transition: TRANSITIONS.FadeIn,
                curve: TRANSITION_CURVES.Liquid,
                duration: 0.5,
                when: loading
            }}
            as={`abs abc`}><Spinner type={spinner} /></Box>
        { _(label).isEmpty() ? <Box as={`--dot --${type}`} /> 
            : <Text as={`--label`}>{label}</Text>}
    </Box>
}

export default Badge;