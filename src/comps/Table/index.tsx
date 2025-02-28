import { forwardRef, useMemo, useRef, JSX, Ref } from "react";
import type { TableProps, Row, Column } from "./types";
import Box from "../Box";
import { useBase } from "../../hooks";
import TRow from "./row";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
import { dynamicObject } from "../../types";
import { PubSub, uuid } from "../..";

// const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {
const Table = <T, >(props: TableProps<T>, ref: Ref<HTMLDivElement>) => {

    const { 
        schema, 
        rows, 
        rowCount,
        rowsPerPage,
        currentPage,
        pagination,
        animateRows,
        header,
        showPaginationOnZeroPageCount,
        rowClassName,
        selectableRows,
        onRowSelectToggle,
        onPageChange,
        onRowContextMenu,
        ...pops 
    } = props
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
    const rowKeys = useMemo(() => rows.map(() => uuid()), [rows]);

    return <Box as={`--table flex cols ${className}`} ref={_tableRef}>
        {_header == true && <TRow tableRef={_tableRef} pubsub={pubsub} selectable={selectableRows} index={-1} schema={schema} styles={_schemaParsed}  /> }
        {rows && rows.map((row, index: number) => <TRow 
            key={`--trow-${rowKeys[index]}-${schema[0].id}`} 
            tableRef={_tableRef}
            pubsub={pubsub}
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
        { pagination && <Box as={`--row flex aic --row-footer`}>
            <Pagination
                renderOnZeroPageCount={showPaginationOnZeroPageCount}
                onPageChange={onPageChange}
                paginationStyle={PaginationStyle.Table}
                itemCount={rowCount || (rows ? rows.length : 0)}
                itemsPerPage={rowsPerPage || 10}
            />
        </Box> }
    </Box>

}

const ForwardedTable = forwardRef(Table) as <T>(props: TableProps<T> & { ref?: Ref<HTMLDivElement> }) => JSX.Element

export default ForwardedTable