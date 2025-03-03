import { PaginationPage, PaginationStyle } from "./types";
declare const Pagination: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
    itemCount: number;
    itemsPerPage: number;
    startPage?: PaginationPage;
    pageRange?: number;
    paginationStyle?: PaginationStyle;
    breakLabel?: string;
    nextLabel?: string;
    prevLabel?: string;
    renderOnZeroPageCount?: boolean;
    onPageChange?: import("./types").PaginationCallback;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Pagination;
