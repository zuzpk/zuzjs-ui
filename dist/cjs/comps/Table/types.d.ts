import { ReactNode, RefObject } from "react";
import { PubSub, SPINNER } from "../..";
import { dynamicObject } from "../../types";
import { BoxProps } from "../Box";
import { PaginationCallback } from "../Pagination/types";
/**
 * Callback function for row selection.
 *
 * @template T - The type of data for each row.
 * @param {T} row - The row data.
 * @param {boolean} selected - Whether the row is selected.
 */
export type RowSelectCallback<T> = (row: T, selected: boolean) => void;
/**
 * Callback function for table sorting.
 *
 * @param {string} col - The column key to sort by.
 * @param {number} dir - The direction of sorting (1 for ascending, -1 for descending).
 */
export type TableSortCallback = (col: string, dir: number) => void;
/**
 * Represents a row in the table.
 *
 * @template T - The type of data for each row.
 *
 * @property {number} index - The index of the row.
 * @property {Column<T>[]} schema - The schema defining the columns of the row.
 * @property {dynamicObject} styles - The styles to apply to the row.
 * @property {string[]} [ids] - The IDs associated with the row.
 * @property {boolean} [animate] - Whether to animate the row.
 * @property {T} [data] - The data for the row.
 * @property {string} [rowClassName] - The CSS class name to apply to the row.
 * @property {boolean} [selectable] - Whether the row is selectable.
 * @property {string | null} [sortBy] - The column key to sort by.
 * @property {RowSelectCallback<T>} [onSelect] - Callback when the row's selection state changes.
 * @property {TableSortCallback} [onSort] - Callback when the row is sorted.
 * @property {PubSub} pubsub - The PubSub instance for event handling.
 * @property {RefObject<HTMLDivElement | null>} [tableRef] - The reference to the table element.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void} [onContextMenu] - Callback for row context menu event.
 */
export type Row<T> = {
    index: number;
    schema: Column<T>[];
    styles: dynamicObject;
    ids?: string[];
    animate?: boolean;
    data?: T;
    rowClassName?: string;
    selectable?: boolean;
    sortBy?: string | null;
    onSelect?: RowSelectCallback<T>;
    onSort?: TableSortCallback;
    pubsub: PubSub;
    loading: boolean;
    tableRef?: RefObject<HTMLDivElement | null>;
    onContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
};
/**
 * Represents a column in the table.
 *
 * @template T - The type of data for each row.
 *
 * @property {string | number} id - The unique identifier for the column.
 * @property {string | ReactNode | dynamicObject} [value] - The value to display in the column.
 * @property {number} [weight] - The weight of the column for layout purposes.
 * @property {number | string} [w] - The width of the column.
 * @property {number | string} [maxW] - The maximum width of the column.
 * @property {number | string} [minW] - The minimum width of the column.
 * @property {number | string} [h] - The height of the column.
 * @property {number | string} [maxH] - The maximum height of the column.
 * @property {number | string} [minH] - The minimum height of the column.
 * @property {boolean} [resize] - Whether the column is resizable.
 * @property {boolean} [sortable] - Whether the column is sortable.
 * @property {TableSortCallback} [onSort] - Callback when the column is sorted.
 * @property {string} [as] - The HTML tag to render the column as.
 * @property {boolean} [renderWhenHeader] - Whether to render the column when it is a header.
 * @property {(row: T, index: number) => ReactNode} [render] - Function to render the column content.
 */
export type Column<T> = {
    id: string | number;
    value?: string | ReactNode | dynamicObject;
    weight?: number;
    w?: number | string;
    maxW?: number | string;
    minW?: number | string;
    h?: number | string;
    maxH?: number | string;
    minH?: number | string;
    resize?: boolean;
    sortable?: boolean;
    onSort?: TableSortCallback;
    as?: string;
    renderWhenHeader?: boolean;
    render?: (row: T, index: number) => ReactNode;
};
/**
 * Props for the Table component.
 *
 * @template T - The type of data for each row.
 *
 * @extends BoxProps
 *
 * @property {Column<T>[]} schema - The schema defining the columns of the table.
 * @property {T[]} rows - The data rows to be displayed in the table.
 * @property {number} [rowCount] - The total number of rows.
 * @property {number} [rowsPerPage] - The number of rows to display per page.
 * @property {string} [rowClassName] - The CSS class name to apply to each row.
 * @property {number} [currentPage] - The current page number.
 * @property {boolean} [pagination] - Whether to enable pagination.
 * @property {number | null} [paginationHash] - A hash to force pagination update.
 * @property {boolean} [showPaginationOnZeroPageCount] - Whether to show pagination controls when there are zero pages.
 * @property {boolean} [animateRows] - Whether to animate rows on change.
 * @property {boolean} [header] - Whether to show the table header.
 * @property {string} [sortBy] - The column key to sort by.
 * @property {boolean} [selectableRows] - Whether rows are selectable.
 * @property {boolean} [hoverable] - Whether rows should have a hover effect.
 * @property {boolean} [loading] - Renders placeholder rows when true
 * @property {number} [loadingRowCount] - If greater than 0, shows loading number of empty rows with spinner.
 * @property {RowSelectCallback<T>} [onRowSelectToggle] - Callback when a row's selection state changes.
 * @property {(e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void} [onRowContextMenu] - Callback for row context menu event.
 * @property {PaginationCallback} [onPageChange] - Callback when the page changes.
 * @property {TableSortCallback} [onSort] - Callback when the table is sorted.
 */
export type TableProps<T> = BoxProps & {
    schema: Column<T>[];
    rows: T[];
    rowCount?: number;
    rowsPerPage?: number;
    rowClassName?: string;
    currentPage?: number;
    pagination?: boolean;
    paginationHash?: number | null;
    showPaginationOnZeroPageCount?: boolean;
    animateRows?: boolean;
    header?: boolean;
    sortBy?: string;
    selectableRows?: boolean;
    hoverable?: boolean;
    loading?: boolean;
    loadingRowCount?: number;
    loadingMessage?: string;
    spinner?: SPINNER;
    onRowSelectToggle?: RowSelectCallback<T>;
    onRowContextMenu?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, row: T) => void;
    onPageChange?: PaginationCallback;
    onSort?: TableSortCallback;
};
