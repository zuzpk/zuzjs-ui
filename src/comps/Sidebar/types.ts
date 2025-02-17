import { ReactNode } from "react"

export type SidebarProps = {
    layout?: `3-columns` | `2-columns` | `1-column`,
    logo?: ReactNode
}