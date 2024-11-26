"use client"
import { forwardRef } from "react";
import Box, { BoxProps } from "../Box";
import { Size, SPINNER } from "../../types/enums";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import { hexToRgba } from "../../funs";

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
        const _props : dynamicObject = {
            width: _size,
            height: _size,
            border: `${width || 3}px solid ${bg}`,
            borderRadius: `50%`,
            borderTopColor: c,
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        }
        return _props
        
    }

    return <Box
        className={`${className} --spinner --${(type || SPINNER.Simple).toLowerCase()}`.trim()}
        style={{
            ...style,
            ...build()
        }}
        {...rest as BoxProps} />

})

export default Spinner;