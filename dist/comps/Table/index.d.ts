import type { Column } from "./types";
import { dynamicObject } from "../../types";
declare const Table: import("react").ForwardRefExoticComponent<import("../Box").BoxProps & {
    schema: Column[];
    rows?: dynamicObject[];
    rowCount?: number;
    rowsPerPage?: number;
    rowClassName?: string;
    currentPage?: number;
    pagination?: boolean;
    showPaginationOnZeroPageCount?: boolean;
    animateRows?: boolean;
    header?: boolean;
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: dynamicObject) => void;
    onPageChange?: import("../Pagination/types").PaginationCallback;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Table;
