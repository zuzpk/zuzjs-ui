"use client"
import { useImage } from "@zuzjs/hooks";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { AVATAR, BoxProps, Variant } from "../../types";
import Box from "../Box";
import Image from "../Image";
import Text from "../Text";
import { AvatarHandler, AvatarProps } from "./types";


const Avatar = forwardRef<AvatarHandler, AvatarProps>((props, ref) => {
    
    const { 
        src, variant, type, crossOrigin, referrerPolicy, 
        fx, as, alt, color,
        style: inlineStyle,
        ...pops 
    } = props;

    const [ img, imgStatus, imgError ] = useImage(src ?? "", crossOrigin, referrerPolicy);

    const {
        className,
        style: baseStyle,
        rest
    } = useBase({ fx, as })

    return <Box
            className={`--avatar --${variant || Variant.Small} --${(type || AVATAR.Circle).toLowerCase()} rel flex aic jcc ${className}`.trim()}
            style={{
                background: color || `var(--primary)`,
                ...inlineStyle,
                ...baseStyle,
            }}
            {...rest as BoxProps}>
        { src ? <Image   
            src={img}
            crossOrigin={crossOrigin} 
            referrerPolicy={referrerPolicy}
            {...pops } /> : <Text className={`--avatar-label`}>{(alt ? alt.charAt(0) : `A`).toUpperCase()}</Text>}
    </Box>
})

Avatar.displayName = `Zuz.Avatar`

export default Avatar