"use client"
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { AVATAR, BoxProps, Variant } from "../../types";
import Box from "../Box";
import Image from "../Image";
import Text from "../Text";
import { AvatarHandler, AvatarProps } from "./types";


/**
 * Avatar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="User" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Avatar src="https://example.com/avatar.jpg" alt="User" size="lg" variant="rounded" />
 * ```
 * @param src - Source URL
 * @param alt - Alt text
 * @param size - Component size
 * @param variant - Visual variant or style
 */
const Avatar = forwardRef<AvatarHandler, AvatarProps>((props, ref) => {
    
    const { 
        src, variant, type, crossOrigin, referrerPolicy, 
        fx, as, alt, color,
        style: inlineStyle,
        ...pops 
    } = props;

    const {
        className,
        style: baseStyle,
        rest
    } = useBase({ fx, as })

    return <Box
            className={`--avatar --${variant || Variant.Small} --${(type || AVATAR.Circle).toLowerCase()} rel flex aic jcc ${className}`.trim()}
            style={{
                background: color || `var(--avatar-bg, var(--primary))`,
                ...inlineStyle,
                ...baseStyle,
            }}
            {...rest as BoxProps}>
        { src && !(props.skeleton?.enabled ?? false) ? <Image   
            src={src}
            crossOrigin={crossOrigin} 
            referrerPolicy={referrerPolicy}
            {...pops } /> : <Text skeleton={props.skeleton} className={`--avatar-label`}>{(alt ? alt.charAt(0) : `A`).toUpperCase()}</Text>}
    </Box>
})

Avatar.displayName = `Zuz.Avatar`

export default Avatar