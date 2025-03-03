import { PaginationStyle } from "./types";
declare const Pagination: import("react").ForwardRefExoticComponent<import("..").BoxProps & {
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
    onPageChange?: import("./types").PaginationCallback;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Pagination;
