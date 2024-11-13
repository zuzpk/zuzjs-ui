import { BoxProps } from "../Box";
export interface ContextItem {
    label: string;
    labelColor?: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    onSelect: () => void;
}
export type ContextMenuProps = BoxProps & {
    items: ContextItem[];
};
export type MenuItemProps = ContextItem & {
    index: number;
    className: string;
};
export interface ContextMenuHandler {
    show: (e: MouseEvent | TouchEvent) => void;
    hide: (e: MouseEvent | TouchEvent) => void;
}
