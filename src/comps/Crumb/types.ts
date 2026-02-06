import { ReactNode } from "react"
import { BoxProps } from "../../types"

export type CrumbItem = {
    ID?: string,
    label: string,
    icon?: string | ReactNode,
    action?: () => void
}

export type CrumbProps = BoxProps & {
    items: CrumbItem[],
    maxItems?: number
}