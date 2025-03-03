import { ReactNode, RefObject } from "react"
import { PubSub } from "../.."
import { dynamicObject } from "../../types"
import { BoxProps } from "../Box"
import { PaginationCallback } from "../Pagination/types"

export type RowSelectCallback<T> = (row: T, selected: boolean) => void;

export type TableSortCallback = (col: string, dir: number) => void;

export type Row<T> = {
    index: number,
    schema: Column<T>[],
    styles: dynamicObject,
    ids?: string[],
    animate?: boolean,
    data?: T,
    rowClassName?: string,
    selectable?: boolean,
    sortBy?: string | null,
    onSelect?: RowSelectCallback<T>,
    onSort?: TableSortCallback,
    pubsub: PubSub,
    tableRef?: RefObject<HTMLDivElement | null>,
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void,
}

export type Column<T> = {
    id: string | number,
    value?: string | ReactNode | dynamicObject,
    weight?: number,
    w?: number | string,
    maxW?: number | string,
    minW?: number | string,
    h?: number | string,
    maxH?: number | string,
    minH?: number | string,
    resize?: boolean
    sortable?: boolean,
    onSort?: TableSortCallback,
    as?: string,
    renderWhenHeader?: boolean,
    render?: (row: T, index: number) => ReactNode
}

export type TableProps<T> = BoxProps & {
    schema: Column<T>[],
    rows: T[],
    rowCount?: number,
    rowsPerPage?: number,
    rowClassName?: string,
    currentPage?: number,
    pagination?: boolean,
    paginationHash?: number | null,
    showPaginationOnZeroPageCount?: boolean,
    animateRows?: boolean,
    header?: boolean,
    sortBy?: string,
    selectableRows?: boolean,
    hoverable?: boolean,
    onRowSelectToggle?: RowSelectCallback<T>,
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void,
    onPageChange?: PaginationCallback,
    onSort?: TableSortCallback,
}