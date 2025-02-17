import { BoxProps } from "../Box";

export enum PaginationStyle {
    Table = "table",
    Gooey = "gooey",
}

export type PaginationPageItem = { id: string | number, label: string | number }
export type PaginationPage = number | PaginationPageItem
export type PaginationCallback = (page: PaginationPage) => void

export type PaginationProps = BoxProps & {
    itemCount: number, //Total Number of Items
    itemsPerPage: number, //Number of Items Per Page
    startPage?: PaginationPage, //Current Page on Load
    pageRange?: number, //Number of pages to display
    paginationStyle?: PaginationStyle, //Pagination Style
    breakLabel?: string,
    nextLabel?: string,
    prevLabel?: string,
    renderEmpty?: boolean,
    onPageChange?: PaginationCallback
}