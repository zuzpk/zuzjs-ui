import { ReactNode } from "react";
import { BoxProps } from "../Box";
import { Size } from "../../types/enums";
export type IconProps = Omit<BoxProps, `name`> & {
    name: string | ReactNode;
    pathCount?: number;
    size?: Size;
};
declare const Icon: import("react").ForwardRefExoticComponent<Omit<BoxProps, "name"> & {
    name: string | ReactNode;
    pathCount?: number;
    size?: Size;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Icon;
