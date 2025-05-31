import { ReactNode } from "react"
import { BoxProps } from "../Box"

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