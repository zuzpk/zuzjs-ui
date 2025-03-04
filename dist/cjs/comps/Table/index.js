"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useMemo, useRef, useState } from "react";
import { PubSub, uuid } from "../..";
import { useBase } from "../../hooks";
import Box from "../Box";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
import TRow from "./row";
// const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {
const Table = (props, ref) => {
    const { schema, rows, rowCount, rowsPerPage, currentPage, pagination, paginationHash, showPaginationOnZeroPageCount, animateRows, header, rowClassName, selectableRows, hoverable, sortBy, onSort, onRowSelectToggle, onPageChange, onRowContextMenu, ...pops } = props;
    const _schemaParsed = useMemo(() => schema.reduce((prev, c) => {
        prev[c.id] = {
            flex: c.weight || 1,
            ...(c.w && { width: c.w }),
            ...(c.maxW && { maxWidth: c.maxW }),
            ...(c.minW && { minWidth: c.minW }),
            ...(c.h && { height: c.h }),
            ...(c.maxH && { maxHeight: c.maxH }),
            ...(c.minH && { minHeight: c.minH }),
        };
        // prev.push(c.id.toString())
        return prev;
    }, {}), [schema]);
    const _cols = useMemo(() => Object.keys(_schemaParsed), [schema]);
    const _header = useMemo(() => header == undefined ? true : header, [header]);
    const { style, className, rest } = useBase(pops);
    const _tableRef = useRef(null);
    const pubsub = useMemo(() => new PubSub(), []);
    const rowKeys = useMemo(() => rows.map(() => uuid()), [rows]);
    const [_sortBy, setSortBy] = useState(sortBy || null);
    const handleSort = (col, dir) => {
        setSortBy(col);
        onSort?.(col, dir);
    };
    return _jsxs(Box, { as: `--table ${(hoverable ?? true) ? `--hoverable` : ``} flex cols ${className}`, ref: _tableRef, children: [_header == true && _jsx(TRow, { sortBy: _sortBy, onSort: handleSort, tableRef: _tableRef, pubsub: pubsub, selectable: selectableRows, index: -1, schema: schema, styles: _schemaParsed }), rows && rows.map((row, index) => _jsx(TRow, { tableRef: _tableRef, pubsub: pubsub, index: index, schema: schema, ids: _cols, styles: _schemaParsed, animate: animateRows, data: row, rowClassName: rowClassName, selectable: selectableRows, onSelect: onRowSelectToggle, onContextMenu: onRowContextMenu }, `--trow-${rowKeys[index]}-${schema[0].id}`)), pagination && _jsx(Box, { as: `--row flex aic --row-footer`, children: _jsx(Pagination, { hash: paginationHash, renderOnZeroPageCount: showPaginationOnZeroPageCount, onPageChange: onPageChange, paginationStyle: PaginationStyle.Table, startPage: currentPage, itemCount: rowCount || (rows ? rows.length : 0), itemsPerPage: rowsPerPage || 10 }) })] });
};
Table.displayName = `Table`;
const ForwardedTable = forwardRef(Table);
export default ForwardedTable;
