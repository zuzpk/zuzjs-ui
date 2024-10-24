import { forwardRef } from "react";
import { BaseProps } from "../types/interfaces";
import { ALERT, AVATAR } from "../types/enums";
import With from "./base";
import { dynamicObject } from "../types";
import { useImage } from "../hooks";

export interface AvatarProps {
    type?: AVATAR,
    size?: number,
    src: string,
    crossOrigin?: 'anonymous' | 'use-credentials', 
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url' 
}

export interface AvatarHandler {
    
}

const Avatar = forwardRef<AvatarHandler, AvatarProps & BaseProps>((props, ref) => {
    
    const { src, size, type, crossOrigin, referrerPolicy, ...rest } = props;

    const [ img, imgStatus, imgError ] = useImage(src, crossOrigin, referrerPolicy);

    return <With   
        tag={`img`}    
        src={img}
        style={size ? { width: size, height: size } : {}} 
        crossOrigin={crossOrigin} 
        referrerPolicy={referrerPolicy}
        className={`--avatar --${(type || AVATAR.Circle).toLowerCase()}`} 
        {...rest } />

})

export default Avatar