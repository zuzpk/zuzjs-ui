import { AVATAR } from "../../types/enums";
import { AvatarHandler } from "./types";
declare const Avatar: import("react").ForwardRefExoticComponent<import("../../types").ZuzProps & Omit<Omit<import("react").DetailedHTMLProps<import("react").ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>, "ref">, keyof import("../../types").ZuzProps> & {
    type?: AVATAR;
    size?: number;
    variant?: import("../../types/enums").Variant;
    src?: string;
    color?: string;
    crossOrigin?: "anonymous" | "use-credentials";
    referrerPolicy?: "no-referrer" | "no-referrer-when-downgrade" | "origin" | "origin-when-cross-origin" | "same-origin" | "strict-origin" | "strict-origin-when-cross-origin" | "unsafe-url";
} & import("react").RefAttributes<AvatarHandler>>;
export default Avatar;
