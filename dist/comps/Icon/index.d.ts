import { ReactNode } from "react";
import { BoxProps } from "../Box";
export type IconProps = Omit<BoxProps, `name`> & {
    name: string | ReactNode;
    pathCount?: number;
};
declare const Icon: import("react").ForwardRefExoticComponent<Omit<BoxProps, "name"> & {
    name: string | ReactNode;
    pathCount?: number;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Icon;
