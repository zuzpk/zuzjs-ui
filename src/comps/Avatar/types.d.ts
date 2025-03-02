import { Props } from "../../types";
import { AVATAR, Variant } from "../../types/enums";
export type AvatarProps = Props<"img"> & {
    type?: AVATAR;
    size?: number;
    variant?: Variant;
    src?: string;
    color?: string;
    crossOrigin?: 'anonymous' | 'use-credentials';
    referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'origin-when-cross-origin' | 'same-origin' | 'strict-origin' | 'strict-origin-when-cross-origin' | 'unsafe-url';
};
export interface AvatarHandler {
}
