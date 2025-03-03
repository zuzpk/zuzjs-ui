import { BoxProps } from "../Box";

export enum PaginationStyle {
    Table = "table",
    Gooey = "gooey",
}

export type PaginationPageItem = { id: string | number, label: string | number }
export type PaginationPage = number | PaginationPageItem
export type PaginationCallback = (page: PaginationPageItem) => void

export type PaginationProps = BoxProps & {
    itemCount: number, //Total Number of Items
    itemsPerPage: number, //Number of Items Per Page
    startPage?: number | string, //Current Page on Load
    pageRange?: number, //Number of pages to display
    paginationStyle?: PaginationStyle, //Pagination Style
    hash?: number | null, //Hash Length 
    seperator?: string, //Hash seperator
    loading?: boolean,
    breakLabel?: string,
    nextLabel?: string,
    prevLabel?: string,
    renderOnZeroPageCount?: boolean,
    onPageChange?: PaginationCallback
}