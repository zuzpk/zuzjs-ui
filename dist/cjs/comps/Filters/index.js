import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { FILTER } from "../../types/enums";
const Filters = (props) => {
    const { names, strength } = props;
    const filters = {
        [FILTER.Gooey]: (force) => _jsxs("filter", { id: "gooey", children: [_jsx("feGaussianBlur", { in: "SourceGraphic", stdDeviation: force || 10, result: "blur" }), _jsx("feColorMatrix", { in: "blur", mode: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7", result: "goo" }), _jsx("feBlend", { in: "SourceGraphic", in2: "goo" })] }, `filter-${FILTER.Gooey}`)
    };
    useEffect(() => { }, [names]);
    return _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", version: "1.1", children: _jsx("defs", { children: (names || [FILTER.Gooey]).map(name => filters[name](strength)) }) });
};
export default Filters;
