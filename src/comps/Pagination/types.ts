import { BoxProps } from "../../types/interfaces";

export enum PaginationStyle {
    Table = "table",
    Gooey = "gooey",
}

export interface PaginationController {
    setPage: (index: PaginationPage) => void;
    getPage: (index: number) => void;
    setProgress: (index: number) => void;
    getProgress: () => number;
}

export type PaginationPageItem = { id: string | number, label: string | number }
export type PaginationPage = number | PaginationPageItem
export type PaginationCallback = (page: PaginationPageItem) => void

export type PaginationProps = Omit<BoxProps, "ref"> & {
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
    asDots?: boolean,
    progressBar?: boolean,
    renderOnZeroPageCount?: boolean,
    onPageChange?: PaginationCallback
}