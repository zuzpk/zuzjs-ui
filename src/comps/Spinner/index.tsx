"use client"
import { forwardRef } from "react";
import { hexToRgba } from "../../funs";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import { Size, SPINNER } from "../../types/enums";
import Box, { BoxProps } from "../Box";

export type SpinnerProps = BoxProps & {
    type?: SPINNER,
    size?: Size | number,
    width?: number,
    color?: string,
    background?: string,
    foreground?: string,
    speed?: number,
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps >((props, ref) => {

    const { type, size, width, speed, color, background, foreground, ...pops } = props;
    const defaultColor = `#000000`
    const {
        className,
        style,
        rest
    } = useBase(pops)

    const build = () : dynamicObject => {

        const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor)
        const bg = color && color.startsWith(`var`) ? color :  hexToRgba(color || defaultColor, .3)
        const sizes : dynamicObject = {
            [Size.Small]: 20,
            [Size.Medium]: 30,
            [Size.Large]: 50,
            default: 20
        }
        const _size = size ? Object.values(Size).includes(size as Size) ? sizes[size] : size : sizes.default
        const _animationSetting : dynamicObject = {
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        }
        const _props : dynamicObject = ( type || SPINNER.Simple ) == SPINNER.Simple ? {
            width: _size,
            height: _size,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            ..._animationSetting
        } : {
            // ..._animationSetting
        }
        return _props
        
    }

    const child = () => {
        switch( type || SPINNER.Simple ){
            case SPINNER.Simple:
                return null
            case SPINNER.Wave:
                return  <>
                    <Box as={`--dot --dot-1`} />
                    <Box as={`--dot --dot-2`} />
                    <Box as={`--dot --dot-3`} />
                </>
            case SPINNER.Roller:
                return null
        }
    }

    return <Box
        className={`${className} --spinner --${(type || SPINNER.Simple).toLowerCase()} --${size || Size.Default}`.trim()}
        style={{
            ...style,
            ...build()
        }}
        {...rest as BoxProps}>
        {child()}
    </Box>

})

Spinner.displayName = `Spinner`

export default Spinner;