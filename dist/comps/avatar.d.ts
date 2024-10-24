import { BaseProps } from "../types/interfaces";
import { AVATAR } from "../types/enums";
export interface AvatarProps {
    type?: AVATAR;
    size?: number;
    src: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
}
export interface AvatarHandler {
}
declare const Avatar: import("react").ForwardRefExoticComponent<AvatarProps & BaseProps & import("react").RefAttributes<AvatarHandler>>;
export default Avatar;
