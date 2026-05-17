import { ReactNode, Ref } from "react";
import { BoxProps, ValueOf, Variant } from "../../types";

export type IconProps = Omit<BoxProps, `name`> & {
    ref?: Ref<HTMLDivElement>,
    name: string | ReactNode,
    pathCount?: number,
    variant?: ValueOf<typeof Variant>,
    prefix?: string;
    animated?: boolean;
    color?: string,
    size?: number
}