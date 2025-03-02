import { MouseEvent } from "react";
import { BoxProps } from "../Box";
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
    parent?: HTMLElement;
    items?: ContextItem[];
    offsetX?: number;
    offsetY?: number;
};
export type MenuItemProps = ContextItem & {
    index: number;
    className: string;
};
export interface ContextMenuHandler {
    show: (e: MouseEvent<Element, MouseEvent> | TouchEvent, items?: ContextItem[]) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
}
