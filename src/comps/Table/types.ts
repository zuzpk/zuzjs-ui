import { ReactNode } from "react"
import { BoxProps } from "../Box"
import { dynamicObject } from "../../types"
import { PaginationCallback, PaginationPage } from "../Pagination/types"

export type Row = {
    index: number,
    schema: Column[],
    styles: dynamicObject,
    ids?: string[],
    data?: dynamicObject
}

export type Column = {
    id: string | number,
    value: string | dynamicObject,
    weight?: number,
    w?: number | string,
    maxW?: number | string,
    minW?: number | string,
    h?: number | string,
    maxH?: number | string,
    minH?: number | string,
    resize?: boolean
    sort?: boolean,
    render?: (row: dynamicObject) => ReactNode
}

export type TableProps = BoxProps & {
    schema: Column[],
    rows?: dynamicObject[],
    rowCount?: number,
    rowsPerPage?: number,
    currentPage?: number,
    pagination?: boolean,
    onPageChange?: PaginationCallback
}