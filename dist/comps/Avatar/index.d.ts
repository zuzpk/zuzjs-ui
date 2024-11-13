import { AVATAR } from "../../types/enums";
import { Props } from "../../types";
export type AvatarProps = Props<"img"> & {
    type?: AVATAR;
    size?: number;
    src: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
};
export interface AvatarHandler {
}
declare const Avatar: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof import("../../types").ZuzProps> & {
    type?: AVATAR;
    size?: number;
    src: string;
    crossOrigin?: "anonymous" | "use-credentials";
    referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
} & import("react").RefAttributes<AvatarHandler>>;
export default Avatar;
