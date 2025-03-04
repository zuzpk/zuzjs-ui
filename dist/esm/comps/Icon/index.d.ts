import { ReactNode } from "react";
import { Size } from "../../types/enums";
import { BoxProps } from "../Box";
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
