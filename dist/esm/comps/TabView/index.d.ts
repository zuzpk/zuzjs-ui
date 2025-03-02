import { Tab, TabViewHandler } from "./types";
import { BoxProps } from "../Box";
declare const TabView: import("react").ForwardRefExoticComponent<BoxProps & {
    onChange?: (tab: Tab, index: number) => void;
    speed?: number;
    variant?: "fixed" | "default";
    tabs: Tab[];
    prerender?: boolean;
} & import("react").RefAttributes<TabViewHandler>>;
export default TabView;
