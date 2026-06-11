"use client"
import { _ } from '@zuzjs/core';
import React from 'react';
import { useBase } from '../../hooks';
import { Appearance, BoxProps, Status, TRANSITION_CURVES, TRANSITIONS, ValueOf, Variant } from '../../types';
import Box from '../Box';
import Flex from '../Flex';
import Icon from '../Icon';
import Spinner from '../Spinner';
import { SPINNER } from '../Spinner/types';
import Text from '../Text';

export type BadgeProps = BoxProps & {
    /** Badge size. */
    size?: number,
    /** Badge type. */
    type?: ValueOf<typeof Status>,
    /** Badge variant. */
    variant?: ValueOf<typeof Variant>,
    /** Badge appearance kind. */
    kind?: Appearance,
    /** Icon to display inside the badge. */
    icon?: string | null,
    /** Text label. Ignored when `count` is provided. */
    label?: string,
    /** Numeric count to display. Renders a label badge with the count. */
    count?: number,
    /** Cap for `count` — values above this render as `{max}+`. Defaults to 99. */
    max?: number,
    /** Custom color that overrides the semantic `type` color. Accepts any CSS color value. */
    color?: string,
    /** Custom color for the label text. Accepts any CSS color value. */
    labelColor?: string,
    /** Whether the badge is in a loading state. */
    loading?: boolean,
    /** Spinner type to display when `loading` is true. */
    spinner?: ValueOf<typeof SPINNER>,
    /** Whether the badge content should be reversed. */
    reverse?: boolean 
}

const Badge : React.FC<BadgeProps> = ({
    size = 5,
    type = `none`,
    icon,
    label = ``,
    labelColor,
    count,
    max = 99,
    color,
    variant = Variant.Small,
    kind = `solid`,
    loading = false,
    spinner,
    reverse = false,
    ...pops
}) => {

    const { style, className, rest } = useBase<"div">(pops)

    const hasCount = count !== undefined
    const displayCount = hasCount ? (count > max ? `${max}+` : String(count)) : undefined
    const isDot = !hasCount && _(label).isEmpty()

    return <Flex
        aic jcc
        style={{
            ...(isDot ? { "--badge-size": size } : {}),
            ...(color ? { "--badge-color": color } : {}),
            ...(labelColor ? { "--badge-current-color": labelColor } : {}),
            ...style
        }}
        as={`--badge ${reverse ? `--reverse` : ``} ${count ? `--as-counter` : ``} --${kind} --${variant} --${type} rel ${className}`.trim()}>
        <Box
            fx={{
                transition: TRANSITIONS.FadeIn,
                curve: TRANSITION_CURVES.Liquid,
                duration: 0.5,
                when: loading
            }}
            as={`abs abc`}><Spinner type={spinner} /></Box>
        {icon && <Icon name={icon} variant={variant} />}
        {isDot
            ? <Box as={`--dot`} />
            : <Text as={`--label --nous`}>{displayCount ?? label}</Text>
        }
    </Flex>
}

export default Badge;
