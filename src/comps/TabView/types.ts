import { ReactNode } from "react"
import { BoxProps, ValueOf, Variant } from "../../types"

export interface TabBodyProps {
    
    isActive: boolean,
    
    transitionType?: "slide" | "fade" | "scale",

    speed: number,

    width: number,

    render: boolean,

    index: number,

    onHeightChange?: (index: number, height: number) => void,

    content: string | ReactNode | ReactNode[]

}

/**
 * Represents an individual tab configuration within a TabView.
 */
export interface Tab {
    /** 
     * Callback fired when this specific tab is selected. 
     * @example onSelect: (tab) => console.log('Selected', tab.label)
     */
    onSelect?: (tab: Tab, index: number) => void
    /** 
     * Optional tag for identification. 
     * @example tag: "settings-tab"
     */
    tag?: string,
    /** 
     * Unique key for the tab. 
     * @example key: "home"
     */
    key?: string,
    /** 
     * Icon to display next to the label. 
     * @example icon: <HomeIcon />
     */
    icon?: ReactNode | ReactNode[]
    /** 
     * The clickable label of the tab. 
     * @example label: "Profile"
     */
    label: string | ReactNode | ReactNode[]
    /** 
     * The content to display when the tab is active. 
     * @example body: <div>Welcome to your profile</div>
     */
    body: string | ReactNode | ReactNode[]
    /**
     * If true, the tab content will be rendered even when not active.
     * Useful for maintaining state in complex forms or maps.
     * @example render: true
     */
    render?: boolean,
}

/**
 * Internal props for the individual Tab trigger component.
 */
export type TabProps = {
    /** The tab configuration object. */
    tab: Tab,
    /** The index of this tab. */
    index: number,
    /** The currently active tab index. */
    activeTab: number,
    /** Click handler to change the active tab. */
    onClick: (index: number) => void,
}

/**
 * Props for the TabView component.
 */
export type TabViewProps = Omit<BoxProps, "onChange" | "height"> & {
    /** Callback fired when the active tab changes. */
    onChange?: (tab: Tab, index: number) => void,
    /** 
     * Animation speed in milliseconds for tab transitions. 
     * @default 300
     * @example speed: 500
     */
    speed?: number,
    /** 
     * The tabs layout style. 
     * `fixed` distributes tab width equally. 
     * `default` sizes tabs based on content.
     * @example tabStyle: "fixed"
     */
    tabStyle?: "fixed" | "default",

    variant?: ValueOf<typeof Variant>,

    transitionType?: "slide" | "fade" | "scale",

    /** 
     * Controls the tab body height.
     * `fit-content` measures and animates to the active tab body's height.
     * `max-content` grows to the tallest rendered tab body.
     */
    height?: "fit-content" | "max-content",
    /**
     * Array of tab objects to render. 
     * @example tabs={[{ label: 'Tab 1', body: 'Content 1' }]}
     */
    tabs: Tab[],
    /** 
     * If true, all tab bodies are rendered to the DOM immediately. 
     * Useful for SEO or performance on small tab sets.
     * @example prerender: true
     */
    prerender?: boolean,
}

/**
 * Ref handle for controlling the TabView imperatively.
 */
export interface TabViewHandler {
    /** 
     * Programmatically set the active tab by index.
     * @param index The index of the tab to activate.
     * @example ref.current?.setTab(1)
     */
    setTab: (index: number) => void
}
