import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { SVGIcons } from "../..";
import Box from "../Box";
const TColumn = (props) => {
    const { idx, id, as, weight, style, value, render, resize, sortBy, sortable, onSort } = props;
    const [_sort, setSort] = useState(0);
    const _onSort = () => {
        if (sortable) {
            onSort?.(String(id), _sort == 1 ? -1 : 1);
            setSort(prev => prev == 1 ? -1 : 1);
        }
    };
    return _jsxs(Box, { style: {
            flex: weight || 1,
            ...style
        }, as: `--col flex aic ${as || ``} ${sortable ? `--sortable` : ``}`, onClick: _onSort, children: [_jsx(Box, { children: value }), idx == -1
                && sortable
                && sortBy == id
                && _jsx(Box, { as: `--arrow flex aib`, children: _sort == 1 ? SVGIcons.arrowUp : SVGIcons.arrowDown })] });
};
TColumn.displayName = `Column`;
export default TColumn;
