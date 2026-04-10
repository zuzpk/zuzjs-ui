import { ReactNode } from "react";
import { BoxProps, LayerHandler, Placement, ValueOf } from "../../types";
import { DRAWER_SIDE, TRANSITION_CURVES } from "../../types/enums";

export type DrawerProps = Omit<BoxProps, `id`> & {
    id?: number,
    index?: number,
    as?: string,
    speed?: number,
    from?: ValueOf<typeof DRAWER_SIDE>,
    children?: string | ReactNode | ReactNode[],
    prerender?: boolean,
    margin?: number,
    animation?: ValueOf<typeof TRANSITION_CURVES>,
    closeBtn?: Extract<Placement, "left" | "right">,
    onClose?: (id: number) => void,
} & LayerHandler

export interface DrawerHandler {
    open: (child?: string | ReactNode | ReactNode[]) => void,
    close: () => void,
}