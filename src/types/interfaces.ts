import { DetailedHTMLProps, HTMLAttributes } from "react"
import { animationProps } from "../comps/base"

export interface BaseProps {
    as?: string,
    animate?: animationProps,
    editor?: boolean
}

export interface FormatNumberParams {
    number: number | string
    locale: string
    style?: `decimal` | `currency` | `percent`,
    decimal?: number,
    currency?: {
        code: string
        style: `symbol` | `code` | `name`
        symbol?: string
    }
}

export interface UIProps<T extends HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
    [key: string] : any
}