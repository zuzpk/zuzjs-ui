import { ReactNode } from "react";
import { BaseProps } from "../types/interfaces";
export interface Tab {
    onSelect: (tab: Tab, index: number) => void;
    tag?: string;
    key?: string;
    label: string | ReactNode | ReactNode[];
    body: string | ReactNode | ReactNode[];
    render?: boolean;
}
export interface TabViewProps {
    onChange?: (tab: Tab, index: number) => void;
    speed?: number;
    tabs: Tab[];
    prerender?: boolean;
}
export interface TabViewHandler {
    setTab: (index: number) => void;
}
declare const TabView: import("react").ForwardRefExoticComponent<TabViewProps & BaseProps & import("react").RefAttributes<TabViewHandler>>;
export default TabView;
