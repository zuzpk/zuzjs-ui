import { forwardRef, useMemo } from "react";
import type { TableProps, Row, Column } from "./types";
import Box from "../Box";
import { useBase } from "../../hooks";
import TRow from "./row";
import Pagination from "../Pagination";
import { PaginationStyle } from "../Pagination/types";
import { dynamicObject } from "../../types";

const Table = forwardRef<HTMLDivElement, TableProps>((props, ref) => {

    const { 
        schema, 
        rows, 
        rowCount,
        rowsPerPage,
        currentPage,
        pagination,
        animateRows,
        onPageChange,
        ...pops 
    } = props
    const _schemaParsed = useMemo(() => schema.reduce((prev, c: Column) => {
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

    const {
        style,
        className,
        rest
    } = useBase(pops)

    return <Box as={`--table flex cols ${className}`}>
        <TRow index={-1} schema={schema} styles={_schemaParsed}  />
        {rows && rows.map((row: any, index: number) => <TRow 
            key={`--trow-${index}`} 
            index={index} 
            schema={schema} 
            ids={_cols}
            styles={_schemaParsed}
            animate={animateRows} 
            data={row} />)}
        { pagination && <Box as={`--row flex aic --row-footer`}>
            <Pagination 
                onPageChange={onPageChange}
                paginationStyle={PaginationStyle.Table}
                itemCount={rowCount || (rows ? rows.length : 0)}
                itemsPerPage={rowsPerPage || 10}
            />
        </Box> }
    </Box>

})

export default Table