import { forwardRef, useCallback, useMemo, useState } from "react";
import { PaginationPage, PaginationPageItem, PaginationProps, PaginationStyle } from "./types";
import { useBase } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import SVGIcons from "../svgicons";

const Pagination = forwardRef<HTMLDivElement, PaginationProps>((props, ref) => {

    const { 
        itemCount, 
        itemsPerPage,
        startPage,
        pageRange,
        paginationStyle,
        breakLabel,
        prevLabel,
        nextLabel,
        renderEmpty,
        onPageChange,
        ...pops } = props

    const [ _currentPage, setCurrentPage ] = useState<PaginationPage>(startPage || 1)
    const _breakLabel = useMemo(() => breakLabel || `...`, [breakLabel])
    
    /**
     * @internal
     * const _pageType = useMemo(() => startPage ? `number` === startPage, [breakLabel])
     */

    const {
        style,
        className,
        rest
    } = useBase(pops)

    const getPageValue = useCallback((p: PaginationPage) : number => {
        return (`number` === typeof p ? p : +(p as PaginationPageItem).label)
    }, [])

    if ( !itemCount ) throw new Error(`"itemCount" prop is required`)
    
    const totalPages = useMemo(() => Math.ceil(itemCount / itemsPerPage), [itemCount, itemsPerPage])
    const pages : (number | string)[] = useMemo(() => {

        const _pages : (number | string)[] = []
        const prevs = Math.max( getPageValue(_currentPage) - (pageRange || 2), 1)
        const nexts = Math.min( getPageValue(_currentPage) + (pageRange || 2), totalPages)

        if (prevs > 1) _pages.push(1);
        if (prevs > 2) _pages.push(_breakLabel);
        for (let i = prevs; i <= nexts; i++) _pages.push(i);
        if (nexts < totalPages - 1) _pages.push(_breakLabel);
        if (nexts < totalPages) _pages.push(totalPages);

        return _pages

    }, [_currentPage])

    const handlePage = useCallback((newPage: number) => {
        if ( newPage < 1 || newPage > totalPages ) return;
        setCurrentPage(newPage)
        onPageChange?.(newPage);
    }, [itemCount, itemsPerPage, _currentPage])


    return <Box as={`--pagination --pgt-${paginationStyle || PaginationStyle.Table} flex aic w:100% jcc ${className}`}>
        <Box as={`flex flex:1 aic --pgt-btns`}>
            {pages.map((page, index, items) => <Button 
                key={`--pg-${index}-${page}`}
                disabled={page == _breakLabel}
                className={page == getPageValue(_currentPage) ? `--current-page` : ``}
                onClick={(ev) => typeof page == `number` && handlePage(page)}>{page}</Button>)}
        </Box>
        <Box as={`flex aic jcc --pagination-label`}>
            {[
                `Showing ${(getPageValue(_currentPage) - 1) * itemsPerPage + 1} - `,
                `${Math.min(getPageValue(_currentPage) * itemsPerPage, itemCount)} of ${itemCount} items`
            ].join(` `)}
        </Box>
        <Box as={`flex aic jce --pgt-btns --pgt-nav`}>
            <Button onClick={(ev) => handlePage(getPageValue(_currentPage) - 1)}>{SVGIcons.chevronLeftOutline}</Button>
            <Button onClick={(ev) => handlePage(getPageValue(_currentPage) - 1)}>{SVGIcons.chevronRightOutline}</Button>
        </Box>
    </Box>


})

export default Pagination