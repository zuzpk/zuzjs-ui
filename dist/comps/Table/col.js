import { jsx as _jsx } from "react/jsx-runtime";
import Box from "../Box";
const TColumn = (props) => {
    const { idx, id, weight, style, value, render, resize, sort } = props;
    // const style = useMemo(() : CSSStyleDeclaration => style || {
    //     ...(w && { width: w }),
    //     ...(maxW && { maxWidth: maxW }),
    //     ...(minW && { minWidth: minW }),
    //     ...(h && { height: h }),
    //     ...(maxH && { maxHeight: maxH }),
    //     ...(minH && { minHeight: minH }),
    // }), [w, maxW, minW, h, minH, maxH, weight]);
    return _jsx(Box, { style: {
            flex: weight || 1,
            ...style
        }, as: `--col flex aic`, children: value });
};
export default TColumn;
