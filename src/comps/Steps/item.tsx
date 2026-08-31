'use client'

import { useDelayed } from "@zuzjs/hooks"
import { useLayoutEffect, useRef, useState } from "react"
import Box from "../Box"
import Icon from "../Icon"
import { Step, StepItemProps } from "./types"

const StepItem = ({
    step,
    index,
    active,
    completed,
    last,
    direction,
    variant,
    showNumber,
    clickable,
    onClick
}: StepItemProps) => {
    const { icon, label, description, error, disabled } = step as Step
    const hydrated = useDelayed()

    const isClickable = clickable && !disabled
    const showConnector = !last

    const handleClick = () => {
        if (isClickable && onClick) {
            onClick(index!, step)
        }
    }

    const renderIcon = () => {
        if (icon) {
            return typeof icon === 'string' ? <Icon name={icon} as="--step-icon-svg" /> : icon
        }
        if (completed) {
            return <Icon name="check" as="--step-icon-svg" />
        }
        if (error) {
            return <Icon name="warning" as="--step-icon-svg" />
        }
        if (showNumber) {
            return (index! + 1).toString()
        }
        return null
    }

    // Build step class names
    const stepClasses = [
        '--step',
        active && '--active',
        completed && '--completed',
        error && '--error',
        disabled && '--disabled',
        isClickable && '--clickable'
    ].filter(Boolean).join(' ')

    // Build icon class names
    const iconClasses = [
        '--step-icon',
        `--step-icon-${variant}`
    ].filter(Boolean).join(' ')

    return (
        <Box className={stepClasses} as={direction === 'vertical' ? 'flex aic' : 'flex aic'} onClick={handleClick}>
            <Box className={iconClasses}>
                {renderIcon()}
            </Box>
            {!last && direction === 'horizontal' && (
                <Box className={`--step-connector ${completed ? '--completed' : ''}`} as="abs" />
            )}
            {!last && direction === 'vertical' && (
                <Box className={`--step-connector ${completed ? '--completed' : ''}`} />
            )}
            <Box className="--step-content">
                {label && <Box className="--step-label">{label}</Box>}
                {description && <Box className="--step-description">{description}</Box>}
            </Box>
        </Box>
    )
}

StepItem.displayName = 'StepItem'

export default StepItem
