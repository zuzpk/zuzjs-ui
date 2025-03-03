import { BoxProps } from "../Box";
export declare enum PaginationStyle {
    Table = "table",
    Gooey = "gooey"
}
export type PaginationPageItem = {
    id: string | number;
    label: string | number;
};
export type PaginationPage = number | PaginationPageItem;
export type PaginationCallback = (page: PaginationPageItem) => void;
export type PaginationProps = BoxProps & {
    itemCount: number;
    itemsPerPage: number;
    startPage?: number | string;
    pageRange?: number;
    paginationStyle?: PaginationStyle;
    hash?: number | null;
    seperator?: string;
    loading?: boolean;
    breakLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    renderOnZeroPageCount?: boolean;
    onPageChange?: PaginationCallback;
};
