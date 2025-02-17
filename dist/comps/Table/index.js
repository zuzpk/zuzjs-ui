import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import Box from "../Box";
import { useBase } from "../../hooks";
import TRow from "./row";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
const Table = forwardRef((props, ref) => {
    const { schema, rows, rowCount, rowsPerPage, currentPage, pagination, onPageChange, ...pops } = props;
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
    const { style, className, rest } = useBase(pops);
    return _jsxs(Box, { as: `--table flex cols ${className}`, children: [_jsx(TRow, { index: -1, schema: schema, styles: _schemaParsed }), rows && rows.map((row, index) => _jsx(TRow, { index: index, schema: schema, ids: _cols, styles: _schemaParsed, data: row }, `--trow-${index}`)), pagination && _jsx(Box, { as: `--row flex aic --row-footer`, children: _jsx(Pagination, { onPageChange: onPageChange, paginationStyle: PaginationStyle.Table, itemCount: rowCount || (rows ? rows.length : 0), itemsPerPage: rowsPerPage || 10 }) })] });
});
export default Table;
