import { ReactNode, RefObject } from "react"
import { BoxProps } from "../Box"
import { dynamicObject } from "../../types"
import { PaginationCallback, PaginationPage } from "../Pagination/types"
import { PubSub } from "../.."

export type RowSelectCallback<T> = (row: T, selected: boolean) => void;

export type Row<T> = {
    index: number,
    schema: Column<T>[],
    styles: dynamicObject,
    ids?: string[],
    animate?: boolean,
    data?: T,
    rowClassName?: string,
    selectable?: boolean,
    onSelect?: RowSelectCallback<T>,
    pubsub: PubSub,
    tableRef?: RefObject<HTMLDivElement | null>,
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void,
}

export type Column<T> = {
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
    showPaginationOnZeroPageCount?: boolean,
    animateRows?: boolean,
    header?: boolean,
    selectableRows?: boolean,
    // onRowSelectToggle?: (row: T, selected: boolean) => void,
    onRowSelectToggle?: RowSelectCallback<T>,
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void,
    onPageChange?: PaginationCallback
}