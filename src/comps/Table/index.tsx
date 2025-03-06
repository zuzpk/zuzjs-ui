"use client"
import { forwardRef, JSX, Ref, useEffect, useMemo, useRef, useState } from "react";
import { PubSub, SPINNER, Spinner, Text, uuid } from "../..";
import { useBase } from "../../hooks";
import { dynamicObject } from "../../types";
import Box from "../Box";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
import TRow from "./row";
import type { Column, TableProps, TableSortCallback } from "./types";

// const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {
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

    const _paginated = useMemo(() => <Pagination
        hash={paginationHash}
        ref={_pagination}
        renderOnZeroPageCount={showPaginationOnZeroPageCount}
        onPageChange={onPageChange}
        paginationStyle={PaginationStyle.Table}
        startPage={currentPage}
        itemCount={rowCount || (rows ? rows.length : 0)}
        itemsPerPage={rowsPerPage || 10}
    />, [])

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
        { pagination && _pagination.current != null && <Box as={`--row flex aic --row-footer`}>{_paginated}</Box> }
    </Box>

}

Table.displayName = `Table`

const ForwardedTable = forwardRef(Table) as <T>(props: TableProps<T> & { ref?: Ref<HTMLDivElement> }) => JSX.Element

export default ForwardedTable