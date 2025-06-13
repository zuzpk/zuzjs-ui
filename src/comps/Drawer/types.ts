import { ReactNode } from "react";
import { DRAWER_SIDE, TRANSITION_CURVES } from "../../types/enums";
import { BoxProps } from "../Box";

export type DrawerProps = BoxProps & {
    as?: string,
    speed?: number,
    from?: DRAWER_SIDE,
    children?: string | ReactNode | ReactNode[],
    prerender?: boolean,
    margin?: number,
    animation?: TRANSITION_CURVES,
    onClose?: () => void,
}

export interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void,
    close: () => void,
}