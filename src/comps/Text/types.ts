import { ReactNode, Ref } from "react";
import { Props } from "../../types";

export type TextFxVariant = 'bounce' | 'wave' | 'slide' | 'fade' | 'glitch' | `glitch-v2` | 'typewriter' | `fog` | `pop` | `reveal` | `shuffle`;

export type TextProps = Props<`h1` | `h2` | `h3` | `h4` | `h5` | `h6` | `p` | `span` | `div` | `label`> & {
    ref?: Ref<HTMLHeadingElement>;
    h?: number;
    html?: ReactNode | string;
    lines?: number;
    tfx?: TextFxVariant;
    /** Init delay before animation starts */
    delay?: number;
    duration?: number;
    stagger?: number;
    repeat?: boolean;
    reveal?: boolean;
    hover?: boolean;
}