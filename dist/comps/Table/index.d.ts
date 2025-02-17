import type { Column } from "./types";
import { dynamicObject } from "../../types";
declare const Table: import("react").ForwardRefExoticComponent<import("../Box").BoxProps & {
    schema: Column[];
    rows?: dynamicObject[];
    rowCount?: number;
    rowsPerPage?: number;
    currentPage?: number;
    pagination?: boolean;
    onPageChange?: import("../Pagination/types").PaginationCallback;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Table;
