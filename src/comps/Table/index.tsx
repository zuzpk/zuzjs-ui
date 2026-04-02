"use client"
import { PubSub, uuid } from "@zuzjs/core";
import { FC, forwardRef, JSX, Ref, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { animationProps, dynamic, TRANSITION_CURVES, TRANSITIONS } from "../../types";
import Box from "../Box";
import Pagination from "../Pagination";
import { PaginationController, PaginationStyle } from "../Pagination/types";
import Spinner from "../Spinner";
import { SPINNER } from "../Spinner/types";
import Text from "../Text";
import TRow from "./row";
import type { Column, TableController, TableProps, TableSortCallback } from "./types";

/**
 * Table component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Table schema={[{ id: "name", value: "Name" }]} rows={[{ name: "Jane Doe" }]} rowsPerPage={10} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Table schema={[{ id: "id", value: "ID" }, { id: "name", value: "Name" }]} rows={[{ id: 1, name: "Jane" }]} sortable filterable rowsPerPage={20} />
 * ```
 * @param schema - schema prop
 * @param rows - Array of row data
 * @param rowsPerPage - rowsPerPage prop
 * @param sortable - sortable prop
 * @param filterable - filterable prop
 */
const Table = <T, >(props: TableProps<T>, ref: Ref<TableController>) => {

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
        loading: _loading,
        loadingRowCount,
        loadingMessage,
        spinner,
        emptyMessage,
        onSort,
        onRowClick,
        onRowSelectToggle,
        onPageChange,
        onRowContextMenu,
        ...pops 
    } = props
    const _pagination = useRef<PaginationController>(null)
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
    }, {} as dynamic), [schema])
    const _cols = useMemo(() => Object.keys(_schemaParsed), [schema])
    const _header = useMemo(() => header == undefined ? true : header, [header])
    const {
        style,
        className,
        rest
    } = useBase(pops)
    const _tableRef = useRef<HTMLDivElement>(null)
    const pubsub = useMemo(() => new PubSub(), [])
    const rowKeys = useRef(rows.map(() => uuid(8)));
    const [_sortBy, setSortBy] = useState<string | null>(sortBy || null)
    // const [ _loading, _setLoading ] = useState(loading || false)
    // const _loading = useRef<boolean>(loading || false)
    const [ _loadingMessage, _setLoadingMessage ] = useState(loadingMessage || `loading`)
    const isEmpty = useMemo(() => !_loading && rows && rows.length == 0, [_loading, rows])

    const renderEmpty = useCallback(() => {
        if ( emptyMessage ){
            if ( typeof emptyMessage == `function` ){
                const Empty = emptyMessage as FC
                return <Empty />
            }
            return emptyMessage
        }
        return <Text as={`tac s:18 mt:75`}>No Record Found</Text>
    }, [_loading, rows])

    useEffect(() => {
        if ( rows.length && !rowKeys.current ) rowKeys.current = rows.map(() => uuid(8)); // Update only when rows change
    }, [rows]);

    // useEffect(() => {
    //     if ( loading != undefined && loading != _loading ) _setLoading(loading)
    // }, [loading])

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

    useImperativeHandle(ref, () => ({
        setLoading( mod: boolean ){
            // _setLoading(mod)
            // _loading.current = mod
        }
    }))

    
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

        {_loading && <Box as={`center-x flex aic --table-spinner`}>
            <Spinner type={spinner || SPINNER.Simple} />
            {_loadingMessage && <Text as={`--table-loading-message`}>{_loadingMessage}</Text>}
        </Box>}

        {_loading && Array(loadingRowCount || 5).fill({}).map((row, index) => <TRow 
            key={`--trow-loading-${index}-${schema[0].id}`} 
            tableRef={_tableRef}
            index={index}
            pubsub={pubsub}
            schema={schema as any}  
            styles={_schemaParsed}
            loading={true}
            animate={animateRows} 
            onRowClick={onRowClick}
            />)}    
        {!_loading && rows && rows.map((row, index: number) => <TRow 
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
            onRowClick={onRowClick}
            rowClassName={rowClassName}
            selectable={selectableRows}
            onSelect={onRowSelectToggle}
            onContextMenu={onRowContextMenu} />)}
        {isEmpty && renderEmpty()}
        {pagination && _paginated && <Box 
            aria-hidden={!pagination || !_paginated}
            {...( animateRows ? { fx: {
                transition: TRANSITIONS.SlideInBottom,
                curve: TRANSITION_CURVES.EaseInOut,
                delay: .02 * (rows.length + 1),
                when: !_loading && rows && pagination && _paginated != null
            } as animationProps} : {} )}
            as={`--row flex aic --row-footer`}>{_paginated}</Box>}
    </Box>

}

Table.displayName = `Zuz.Table`

/**
 * Table component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Table schema={[{ id: "name", value: "Name" }]} rows={[{ name: "Jane Doe" }]} rowsPerPage={10} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Table schema={[{ id: "id", value: "ID" }, { id: "name", value: "Name" }]} rows={[{ id: 1, name: "Jane" }]} sortable filterable rowsPerPage={20} />
 * ```
 */
const ForwardedTable = forwardRef(Table) as <T>(props: TableProps<T> & { ref?: Ref<TableController> }) => JSX.Element

export default ForwardedTable