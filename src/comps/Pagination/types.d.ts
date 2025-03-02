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
export type PaginationCallback = (page: PaginationPage) => void;
export type PaginationProps = BoxProps & {
    itemCount: number;
    itemsPerPage: number;
    startPage?: PaginationPage;
    pageRange?: number;
    paginationStyle?: PaginationStyle;
    breakLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    renderOnZeroPageCount?: boolean;
    onPageChange?: PaginationCallback;
};
