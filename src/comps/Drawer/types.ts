import { ReactNode } from "react";
import { DRAWER_SIDE, TRANSITION_CURVES } from "../../types/enums";
import { BoxProps, ValueOf } from "../../types";

export type DrawerProps = BoxProps & {
    id?: number,
    index?: number,
    as?: string,
    speed?: number,
    from?: ValueOf<typeof DRAWER_SIDE>,
    children?: string | ReactNode | ReactNode[],
    prerender?: boolean,
    margin?: number,
    animation?: ValueOf<typeof TRANSITION_CURVES>,
    onClose?: (id: number) => void,
}

export interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void,
    close: () => void,
}