import { DetailedHTMLProps, HTMLAttributes } from "react"
import { animationProps } from "../comps/base"
import { SKELETON } from "./enums"

export interface Skeleton {
    enabled: boolean,
    type?: SKELETON,
    size?: number | string,
    width?: number | string,
    height?: number | string,
    radius?: number | string
}

export interface BaseProps {
    as?: string,
    animate?: animationProps,
    editor?: boolean,
    skeleton?: Skeleton,
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