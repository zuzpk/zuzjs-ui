"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useMemo, useState } from "react";
import { numberInRange, toHash } from "../..";
import { useBase } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import SVGIcons from "../svgicons";
import { PaginationStyle } from "./types";
const Pagination = forwardRef((props, ref) => {
    const { itemCount, itemsPerPage, startPage, pageRange, paginationStyle, breakLabel, prevLabel, nextLabel, hash, loading, seperator, renderOnZeroPageCount, onPageChange, ...pops } = props;
    const _hashKey = useMemo(() => toHash(numberInRange(4, 8)), []);
    const _hash = useCallback((input) => `${toHash(input, hash || 6, _hashKey)}${seperator || ``}${_hashKey}`, [_hashKey]);
    const _breakLabel = useMemo(() => breakLabel || `...`, [breakLabel]);
    const [_currentPage, setCurrentPage] = useState({
        id: hash ?
            startPage ? `number` == typeof startPage ? _hash(startPage) : startPage
                : 1 : startPage || 1,
        label: startPage || 1
    });
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
            _pages.push({ id: hash ? _hash(1) : 1, label: 1 });
        if (prevs > 2)
            _pages.push({ id: -1, label: _breakLabel });
        for (let i = prevs; i <= nexts; i++)
            _pages.push({ id: hash ? _hash(i) : i, label: i });
        if (nexts < totalPages - 1)
            _pages.push({ id: -1, label: _breakLabel });
        if (nexts < totalPages)
            _pages.push({ id: hash ? _hash(totalPages) : totalPages, label: totalPages });
        return _pages;
    }, [_currentPage]);
    const handlePage = useCallback((_newPage) => {
        const newPage = _newPage;
        if (+newPage.label < 1 || +newPage.label > totalPages)
            return;
        setCurrentPage(newPage);
        onPageChange?.(newPage);
    }, [itemCount, itemsPerPage, _currentPage]);
    if (pages.length <= 1 && ((renderOnZeroPageCount == undefined ? false : renderOnZeroPageCount) === false))
        return null;
    return _jsxs(Box, { ref: ref, as: `--pagination --pgt-${paginationStyle || PaginationStyle.Table} flex aic w:100% jcc ${className}`, children: [_jsx(Box, { as: `flex flex:1 aic --pgt-btns`, children: (pages.length > 1 ? pages : [{ id: 1, label: 1 }, { id: -1, label: _breakLabel }]).map((page, index, items) => _jsx(Button, { disabled: page.id == -1 || getPageValue(_currentPage) == +page.label, className: (`string` == typeof page ? page : page.label) == getPageValue(_currentPage) ? `--current-page` : ``, onClick: (ev) => handlePage(page), children: `string` == typeof page ? page : page.label }, `--pg-${index}-${page.id}`)) }), _jsx(Box, { as: `flex aic jcc flex:1 --pagination-label`, children: [
                    `Showing ${(getPageValue(_currentPage) - 1) * itemsPerPage + 1} - `,
                    `${Math.min(getPageValue(_currentPage) * itemsPerPage, itemCount)} of ${itemCount} items`
                ].join(` `) }), _jsxs(Box, { as: `flex aic jce flex:1 --pgt-btns --pgt-nav`, children: [_jsx(Button, { disabled: getPageValue(_currentPage) <= 1, onClick: (ev) => handlePage({ id: hash ? _hash(getPageValue(_currentPage) - 1) : getPageValue(_currentPage) - 1, label: getPageValue(_currentPage) - 1 }), children: SVGIcons.chevronLeftOutline }), _jsx(Button, { disabled: pages.length <= 1 || getPageValue(_currentPage) == getPageValue(pages[pages.length - 1]), onClick: (ev) => handlePage({ id: hash ? _hash(getPageValue(_currentPage) + 1) : getPageValue(_currentPage) + 1, label: getPageValue(_currentPage) + 1 }), children: SVGIcons.chevronRightOutline })] })] });
});
Pagination.displayName = `Pagination`;
export default Pagination;
