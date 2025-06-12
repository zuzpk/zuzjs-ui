"use client"
import { forwardRef, JSX, Ref, useEffect, useMemo, useRef, useState } from "react";
import { animationProps, PubSub, SPINNER, Spinner, Text, TRANSITION_CURVES, TRANSITIONS, uuid } from "../..";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import Box from "../Box";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
import TRow from "./row";
import type { Column, TableProps, TableSortCallback } from "./types";

/**
 * `Table` is a highly flexible and customizable generic component for rendering data in a tabular format.
 *
 * This component supports features such as:
 * - Dynamic column schema and row data.
 * - Sortable and selectable rows.
 * - Optional pagination with custom control.
 * - Row-level animation and hover states.
 * - Loading placeholders and spinners.
 * - Context menu support for rows.
 *
 * @template T - The shape of the row data object.
 *
 * @param props - The props for configuring the table behavior and appearance.
 * @param props.schema - Column definitions used to render the table header and body.
 * @param props.rows - The array of row data to display.
 * @param props.rowCount - Optional total row count for server-side pagination.
 * @param props.rowsPerPage - Number of rows shown per page.
 * @param props.currentPage - Current page index (for pagination control).
 * @param props.pagination - Whether pagination is enabled.
 * @param props.paginationHash - A value to force pagination re-render.
 * @param props.showPaginationOnZeroPageCount - Show pagination controls even with 0 rows.
 * @param props.animateRows - Whether to animate rows on render/update.
 * @param props.header - Whether to show the header row.
 * @param props.rowClassName - CSS class name to apply to each row.
 * @param props.selectableRows - Whether rows are selectable.
 * @param props.hoverable - Whether rows should show hover styles.
 * @param props.sortBy - Default column key to sort rows.
 * @param props.loading - Enables loading state with placeholder rows and spinner.
 * @param props.loadingRowCount - Number of placeholder rows to render during loading.
 * @param props.loadingMessage - Optional loading text to show next to spinner.
 * @param props.spinner - Spinner type to use when loading.
 * @param props.onSort - Callback when a column header triggers sorting.
 * @param props.onRowSelectToggle - Callback when a row’s selected state changes.
 * @param props.onPageChange - Callback when pagination state changes.
 * @param props.onRowContextMenu - Callback when a row is right-clicked.
 * @param props.className - Additional class names to apply to the root table container.
 * @param props.style - Inline styles to apply to the root table container.
 *
 * @returns The rendered table component.
 *
 * @example
 * ```tsx
 * <Table
 *   schema={[
 *     { id: 'name', value: 'Name', sortable: true },
 *     { id: 'email', value: 'Email' },
 *   ]}
 *   rows={[{ name: 'Kamran', email: 'kamran@example.com' }]}
 *   selectableRows
 *   pagination
 *   loading={false}
 * />
 * ```
 */
const Table = <T, >(props: TableProps<T>, ref: Ref<HTMLDivElement>) => {

    const { 
        schema, 
        rows, 
        rowCount,
        rowsPerPage,
        currentPage,
        pagination,
        paginationHash,
        showPaginationOnZeroPageCount,
        animateRows,
        header,
        rowClassName,
        selectableRows,
        hoverable,
        sortBy,
        loading,
        loadingRowCount,
        loadingMessage,
        spinner,
        onSort,
        onRowSelectToggle,
        onPageChange,
        onRowContextMenu,
        ...pops 
    } = props
    const _pagination = useRef<HTMLDivElement>(null)
    const _schemaParsed = useMemo(() => schema.reduce((prev, c: Column<T>) => {
        prev[c.id] = {
            flex: c.weight || 1,
            ...(c.w && { width: c.w }),
            ...(c.maxW && { maxWidth: c.maxW }),
            ...(c.minW && { minWidth: c.minW }),
            ...(c.h && { height: c.h }),
            ...(c.maxH && { maxHeight:c.maxH }),
            ...(c.minH && { minHeight: c.minH }),
        }
        // prev.push(c.id.toString())
        return prev
    }, {} as dynamicObject), [schema])
    const _cols = useMemo(() => Object.keys(_schemaParsed), [schema])
    const _header = useMemo(() => header == undefined ? true : header, [header])
    const {
        style,
        className,
        rest
    } = useBase(pops)
    const _tableRef = useRef<HTMLDivElement>(null)
    const pubsub = useMemo(() => new PubSub(), [])
    const rowKeys = useRef(rows.map(() => uuid()));
    const [_sortBy, setSortBy] = useState<string | null>(sortBy || null)
    // const placeholderRows = useMemo(() => {

    // }, [loading, loadingRowCount])

    useEffect(() => {
        rowKeys.current = rows.map(() => uuid()); // Update only when rows change
    }, [rows]);

    const handleSort : TableSortCallback = (col, dir) => {
        setSortBy(col)
        onSort?.(col, dir)
    }

    const possiblePage = (rowCount || (rows ? rows.length : 0)) / (rowsPerPage || 10)

    const _paginated = useMemo(() => (showPaginationOnZeroPageCount || (possiblePage > 1)) ? <Pagination
        hash={paginationHash}
        ref={_pagination}
        renderOnZeroPageCount={showPaginationOnZeroPageCount}
        onPageChange={onPageChange}
        paginationStyle={PaginationStyle.Table}
        startPage={currentPage}
        itemCount={rowCount || (rows ? rows.length : 0)}
        itemsPerPage={rowsPerPage || 10}
    /> : null, [currentPage, rowCount])

    
    return <Box as={`--table ${(hoverable ?? true) ? `--hoverable` : ``} flex cols rel ${className}`} ref={_tableRef}>
        {_header == true && <TRow 
            sortBy={_sortBy}
            onSort={handleSort} 
            tableRef={_tableRef} 
            pubsub={pubsub} 
            selectable={selectableRows} 
            index={-1} 
            schema={schema} 
            loading={true}
            styles={_schemaParsed}  /> }

        {loading && <Box as={`abs center-x flex aic --table-spinner`}>
            <Spinner type={spinner || SPINNER.Simple} />
            {loadingMessage && <Text as={`--table-loading-message`}>{loadingMessage}</Text>}
        </Box>}

        {loading && Array(loadingRowCount || 5).fill({}).map((row, index) => <TRow 
            key={`--trow-loading-${index}-${schema[0].id}`} 
            tableRef={_tableRef}
            index={index}
            pubsub={pubsub}
            schema={schema as any}  
            styles={_schemaParsed}
            loading={true}
            animate={animateRows} 
            />)}    
        {!loading && rows && rows.map((row, index: number) => <TRow 
            key={`--trow-${rowKeys.current[index] || index}-${schema[0].id}`} 
            tableRef={_tableRef}
            pubsub={pubsub}
            loading={false}
            index={index} 
            schema={schema}  
            ids={_cols}
            styles={_schemaParsed}
            animate={animateRows} 
            data={row} 
            rowClassName={rowClassName}
            selectable={selectableRows}
            onSelect={onRowSelectToggle}
            onContextMenu={onRowContextMenu} />)}
        <Box 
            aria-hidden={!pagination || !_paginated}
            {...( animateRows ? { fx: {
                transition: TRANSITIONS.SlideInBottom,
                curve: TRANSITION_CURVES.EaseInOut,
                delay: .02 * (rows.length + 1),
                when: !loading && rows && pagination && _paginated != null
            } as animationProps} : {} )}
            as={`--row flex aic --row-footer`}>{pagination && _paginated ? _paginated : null}</Box>
    </Box>

}

Table.displayName = `Zuz.Table`

const ForwardedTable = forwardRef(Table) as <T>(props: TableProps<T> & { ref?: Ref<HTMLDivElement> }) => JSX.Element

export default ForwardedTable