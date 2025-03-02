import { ReactNode } from "react"
import { BoxProps } from "../Box"

export interface Tab {
    onSelect: (tab: Tab, index: number) => void
    tag?: string,
    key?: string,
    icon?: ReactNode | ReactNode[]
    label: string | ReactNode | ReactNode[]
    body: string | ReactNode | ReactNode[]
    render?: boolean,
}

export type TabProps = {
    tab: Tab,
    index: number,
    activeTab: number,
    onClick: (index: number) => void,
}

export type TabViewProps = BoxProps & {
    onChange?: (tab: Tab, index: number) => void,
    speed?: number,
    variant?: "fixed" | "default",
    tabs: Tab[],
    prerender?: boolean,
}

export interface TabViewHandler {
    setTab: (index: number) => void
}
