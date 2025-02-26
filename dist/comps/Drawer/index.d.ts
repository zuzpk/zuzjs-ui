import { ReactNode } from "react";
import { BoxProps } from "../Box";
import { DrawerHandler } from "./types";
import { DRAWER_SIDE } from "../../types/enums";
declare const Drawer: import("react").ForwardRefExoticComponent<BoxProps & {
    as?: string;
    speed?: number;
    from?: DRAWER_SIDE;
    children?: string | ReactNode | ReactNode[];
    prerender?: boolean;
} & import("react").RefAttributes<DrawerHandler>>;
export default Drawer;
