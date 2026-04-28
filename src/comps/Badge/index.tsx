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
    /** Text label. Ignored when `count` is provided. */
    label?: string,
    /** Numeric count to display. Renders a label badge with the count. */
    count?: number,
    /** Cap for `count` — values above this render as `{max}+`. Defaults to 99. */
    max?: number,
    /** Custom color that overrides the semantic `type` color. Accepts any CSS color value. */
    color?: string,
    loading?: boolean,
    spinner?: ValueOf<typeof SPINNER>,
}

const Badge : React.FC<BadgeProps> = ({
    size = 5,
    type = `dead`,
    label = ``,
    count,
    max = 99,
    color,
    variant = Variant.Small,
    loading = false,
    spinner,
    ...pops
}) => {

    const { style, className, rest } = useBase<"div">(pops)

    const hasCount = count !== undefined
    const displayCount = hasCount ? (count > max ? `${max}+` : String(count)) : undefined
    const isDot = !hasCount && _(label).isEmpty()

    return <Box
        style={{
            ...(isDot ? { "--badge-size": size } : {}),
            ...(color ? { "--badge-color": color } : {}),
            ...style
        }}
        as={`--badge ${count ? `--as-counter` : ``} --${variant} --${type} rel flex aic jcc ${className}`.trim()}>
        <Box
            fx={{
                transition: TRANSITIONS.FadeIn,
                curve: TRANSITION_CURVES.Liquid,
                duration: 0.5,
                when: loading
            }}
            as={`abs abc`}><Spinner type={spinner} /></Box>
        {isDot
            ? <Box as={`--dot`} />
            : <Text as={`--label`}>{displayCount ?? label}</Text>
        }
    </Box>
}

export default Badge;
