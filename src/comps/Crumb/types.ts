import { ReactNode } from "react"
import { BoxProps, ValueOf, Variant } from "../../types"

export type CrumbItem = {
    ID?: string,
    label: string,
    icon?: string | ReactNode,
    action?: () => void
}

export type CrumbProps = BoxProps & {
    items: CrumbItem[] | string,
    maxItems?: number,
    /** Base Path to be included when items is string */
    basePath?: string,
    variant?: ValueOf<typeof Variant>,
}