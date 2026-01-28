import { dynamic } from "@zuzjs/core";
import { forwardRef } from "react";
import { hexToRgba } from "../../funs";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import { Size, SPINNER, Variant } from "../../types/enums";
import Box, { BoxProps } from "../Box";

export type SpinnerProps = BoxProps & {
    type?: SPINNER,
    size?: Size | number,
    variant?: Variant | number,
    width?: number,
    color?: string,
    background?: string,
    foreground?: string,
    speed?: number,
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps >((props, ref) => {

    const { type, size, variant, width, speed, color, background, foreground, ...pops } = props;
    const defaultColor = `#000000`
    const {
        className,
        style,
        rest
    } = useBase(pops)

    const build = () : dynamicObject => {

        const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor)
        const bg = color && color.startsWith(`var`) ? color :  hexToRgba(color || defaultColor, .3)
        const sizes : dynamic = {
            [Size.Small]: 20,
            [Size.Medium]: 30,
            [Size.Large]: 50,
            default: 20
        }
        const _size = size ? Object.values(Size).includes(size as Size) ? sizes[size] : size : sizes.default

        const variants : dynamic = {
            [Variant.Small]: 20,
            [Variant.Medium]: 30,
            [Variant.Large]: 50,
            default: 20
        }
        const _variant = variant ? Object.values(Variant).includes(variant as Variant) ? variants[variant] : variant : variants.default

        const _animationSetting : dynamic = {
            animationDuration: `${speed || .6}s`,
            animationTimingFunction: `linear`
        }
        const _props : dynamicObject = ( type || SPINNER.Simple ) == SPINNER.Simple ? {
            width: _variant || _size,
            height: _variant || _size,
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

Spinner.displayName = `Zuz.Spinner`

export default Spinner;