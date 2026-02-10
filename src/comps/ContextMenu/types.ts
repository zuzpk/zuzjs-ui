import { FC, MouseEvent as ReactMouseEvent, ReactNode, RefObject } from "react";
import { BoxProps, ORIGIN, ValueOf } from "../../types";

export interface ContextItem {
    label: string;
    labelColor?: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    enabled?: boolean;
    onSelect: () => void;
}

export type ContextMenuProps = BoxProps & {
    id?: number,
    event?: ReactMouseEvent<Element, MouseEvent> | TouchEvent,
    parent?: RefObject<HTMLElement | null>,
    origin?: ValueOf<typeof ORIGIN>
    items?: ContextItem[],
    offsetX?: number,
    offsetY?: number,
    header?: ReactNode | FC,
    footer?: ReactNode | FC,
    when?: boolean,
    onClose?: (id: number) => void
}

export type MenuItemProps = ContextItem & {
    index: number;
    className: string;
}

export interface ContextMenuHandler {
    show: (e: ReactMouseEvent<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    hide: (e: ReactMouseEvent | TouchEvent) => void;
}