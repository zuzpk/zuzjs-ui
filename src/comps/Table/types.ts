import { ReactNode } from "react"
import { BoxProps } from "../Box"
import { dynamicObject } from "../../types"
import { PaginationCallback, PaginationPage } from "../Pagination/types"

export type Row = {
    index: number,
    schema: Column[],
    styles: dynamicObject,
    ids?: string[],
    animate?: boolean,
    data?: dynamicObject,
    rowClassName?: string,
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: dynamicObject) => void,
}

export type Column = {
    id: string | number,
    value: string | ReactNode | dynamicObject,
    weight?: number,
    w?: number | string,
    maxW?: number | string,
    minW?: number | string,
    h?: number | string,
    maxH?: number | string,
    minH?: number | string,
    resize?: boolean
    sort?: boolean,
    renderWhenHeader?: boolean,
    render?: (row: dynamicObject, index: number) => ReactNode
}

export type TableProps = BoxProps & {
    schema: Column[],
    rows?: dynamicObject[],
    rowCount?: number,
    rowsPerPage?: number,
    rowClassName?: string,
    currentPage?: number,
    pagination?: boolean,
    showPaginationOnZeroPageCount?: boolean,
    animateRows?: boolean,
    header?: boolean,
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: dynamicObject) => void,
    onPageChange?: PaginationCallback
}