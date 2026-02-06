import { dynamic, hexToRgba } from "@zuzjs/core";
import { useBase } from "../../hooks";
import Box from "../Box";
import { SPINNER, SpinnerProps } from "./types";
import type { BoxProps } from "../../types";

const Spinner = (props : SpinnerProps) => {

    const { type, variant, width, speed, color, background, foreground, ...pops } = props;
    const defaultColor = `#000000`
    const {
        className,
        style,
        rest
    } = useBase(pops)

    // const build = () : dynamic => {

    //     const c = color && color.startsWith(`var`) ? color : hexToRgba(color || defaultColor)
    //     const bg = color && color.startsWith(`var`) ? color :  hexToRgba(color || defaultColor, .3)
    //     const sizes : dynamic = {
    //         [Size.Small]: 20,
    //         [Size.Medium]: 30,
    //         [Size.Large]: 50,
    //         default: 20
    //     }
    //     const _size = size ? Object.values(Size).includes(size as Size) ? sizes[size] : size : sizes.default

    //     const variants : dynamic = {
    //         [Variant.Small]: 20,
    //         [Variant.Medium]: 30,
    //         [Variant.Large]: 50,
    //         default: 20
    //     }
    //     const _variant = variant ? Object.values(Variant).includes(variant as Variant) ? variants[variant] : variant : variants.default

    //     const _animationSetting : dynamic = {
    //         animationDuration: `${speed || .6}s`,
    //         animationTimingFunction: `linear`
    //     }
    //     const _props : dynamic = ( type || SPINNER.Simple ) == SPINNER.Simple ? {
    //         width: _variant || _size,
    //         height: _variant || _size,
    //         border: `${width || 3}px solid ${bg}`,
    //         borderRadius: `50%`,
    //         borderTopColor: c,
    //         ..._animationSetting
    //     } : {
    //         // ..._animationSetting
    //     }
    //     return _props
        
    // }

    // const child = () => {
    //     switch( type || SPINNER.Simple ){
    //         case SPINNER.Simple:
    //             return null
    //         case SPINNER.Wave:
    //             return  <>
    //                 <Box as={`--dot --dot-1`} />
    //                 <Box as={`--dot --dot-2`} />
    //                 <Box as={`--dot --dot-3`} />
    //             </>
    //         case SPINNER.Roller:
    //             return null
    //     }
    // }

    return <Box
        className={`${className} --spinner --${(type || SPINNER.Simple).toLowerCase()} --${variant}`.trim()}
        style={{
            ...style,
            // ...build()
        }}
        {...rest as BoxProps}>
        {/* {child()} */}
    </Box>

}

Spinner.displayName = `Zuz.Spinner`

export default Spinner;