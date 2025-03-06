import { Tab, TabViewHandler } from "./types";
declare const TabView: import("react").ForwardRefExoticComponent<Omit<import("..").BoxProps, "onChange"> & {
    onChange?: (tab: Tab, index: number) => void;
    speed?: number;
    variant?: "fixed" | "default";
    tabs: Tab[];
    prerender?: boolean;
} & import("react").RefAttributes<TabViewHandler>>;
export default TabView;
