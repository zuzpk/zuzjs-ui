import { ReactNode } from "react";
import { DRAWER_SIDE } from "../types/enums";
export interface DrawerProps {
    as?: string;
    speed?: number;
    from?: DRAWER_SIDE;
    children: string | ReactNode | ReactNode[];
    prerender?: boolean;
}
export interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void;
    close: () => void;
}
declare const Drawer: import("react").ForwardRefExoticComponent<DrawerProps & import("react").RefAttributes<DrawerHandler>>;
export default Drawer;
