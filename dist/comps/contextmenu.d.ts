import { animationProps } from "./base";
export interface ContextMenuItem {
    label: string;
    labelColor?: string;
    icon?: string;
    iconColor?: string;
    className?: string;
    onSelect: () => void;
}
declare const ContextMenu: import("react").ForwardRefExoticComponent<{
    as?: string;
    items: ContextMenuItem[];
    animate?: animationProps;
} & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLDivElement>, HTMLDivElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export default ContextMenu;
