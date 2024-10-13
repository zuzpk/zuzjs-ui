import { ReactNode } from "react";
import { BaseProps } from "../types/interfaces";
export interface Tab {
    onSelect: (index: number) => void;
    label: string;
    body: string | ReactNode | ReactNode[];
    render?: boolean;
}
export interface TabViewProps {
    speed?: number;
    tabs: Tab[];
}
export interface TabViewHandler {
    setTab: (index: number) => void;
}
declare const TabView: import("react").ForwardRefExoticComponent<TabViewProps & BaseProps & import("react").RefAttributes<TabViewHandler>>;
export default TabView;
