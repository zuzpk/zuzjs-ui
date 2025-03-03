import { ReactNode } from "react";
import { DRAWER_SIDE } from "../../types/enums";
import { BoxProps } from "../Box";
import { DrawerHandler } from "./types";
declare const Drawer: import("react").ForwardRefExoticComponent<BoxProps & {
    as?: string;
    speed?: number;
    from?: DRAWER_SIDE;
    children?: string | ReactNode | ReactNode[];
    prerender?: boolean;
    onClose?: () => void;
} & import("react").RefAttributes<DrawerHandler>>;
export default Drawer;
