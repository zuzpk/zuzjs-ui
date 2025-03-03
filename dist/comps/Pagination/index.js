'use client';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { PaginationStyle } from "./types";
import { useBase } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import SVGIcons from "../svgicons";
const Pagination = forwardRef((props, ref) => {
    const { itemCount, itemsPerPage, startPage, pageRange, paginationStyle, breakLabel, prevLabel, nextLabel, renderOnZeroPageCount, onPageChange, ...pops } = props;
    const [_currentPage, setCurrentPage] = useState(startPage || 1);
    const _breakLabel = useMemo(() => breakLabel || `...`, [breakLabel]);
    /**
     * @internal
     * const _pageType = useMemo(() => startPage ? `number` === startPage, [breakLabel])
     */
    const { style, className, rest } = useBase(pops);
    const getPageValue = useCallback((p) => {
        return (`number` === typeof p ? p : +p.label);
    }, []);
    if (!itemCount)
        throw new Error(`"itemCount" prop is required`);
    const totalPages = useMemo(() => Math.ceil(itemCount / itemsPerPage), [itemCount, itemsPerPage]);
    const pages = useMemo(() => {
        const _pages = [];
        const prevs = Math.max(getPageValue(_currentPage) - (pageRange || 2), 1);
        const nexts = Math.min(getPageValue(_currentPage) + (pageRange || 2), totalPages);
        if (prevs > 1)
            _pages.push(1);
        if (prevs > 2)
            _pages.push(_breakLabel);
        for (let i = prevs; i <= nexts; i++)
            _pages.push(i);
        if (nexts < totalPages - 1)
            _pages.push(_breakLabel);
        if (nexts < totalPages)
            _pages.push(totalPages);
        return _pages;
    }, [_currentPage]);
    const handlePage = useCallback((newPage) => {
        if (newPage < 1 || newPage > totalPages)
            return;
        setCurrentPage(newPage);
        onPageChange?.(newPage);
    }, [itemCount, itemsPerPage, _currentPage]);
    if (pages.length <= 1 && ((renderOnZeroPageCount == undefined ? false : renderOnZeroPageCount) === false))
        return null;
    return _jsxs(Box, { as: `--pagination --pgt-${paginationStyle || PaginationStyle.Table} flex aic w:100% jcc ${className}`, children: [_jsx(Box, { as: `flex flex:1 aic --pgt-btns`, children: (pages.length > 1 ? pages : [1, _breakLabel]).map((page, index, items) => _jsx(Button, { disabled: page == _breakLabel || getPageValue(_currentPage) == page, className: page == getPageValue(_currentPage) ? `--current-page` : ``, onClick: (ev) => typeof page == `number` && handlePage(page), children: page }, `--pg-${index}-${page}`)) }), _jsx(Box, { as: `flex aic jcc flex:1 --pagination-label`, children: [
                    `Showing ${(getPageValue(_currentPage) - 1) * itemsPerPage + 1} - `,
                    `${Math.min(getPageValue(_currentPage) * itemsPerPage, itemCount)} of ${itemCount} items`
                ].join(` `) }), _jsxs(Box, { as: `flex aic jce flex:1 --pgt-btns --pgt-nav`, children: [_jsx(Button, { disabled: getPageValue(_currentPage) <= 1, onClick: (ev) => handlePage(getPageValue(_currentPage) - 1), children: SVGIcons.chevronLeftOutline }), _jsx(Button, { disabled: pages.length <= 1 || getPageValue(_currentPage) == pages[pages.length - 1], onClick: (ev) => handlePage(getPageValue(_currentPage) - 1), children: SVGIcons.chevronRightOutline })] })] });
});
export default Pagination;
