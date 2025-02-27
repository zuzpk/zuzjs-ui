import { jsx as _jsx } from "react/jsx-runtime";
import Box from "../Box";
const TColumn = (props) => {
    const { idx, id, weight, style, value, render, resize, sort } = props;
    return _jsx(Box, { style: {
            flex: weight || 1,
            ...style
        }, as: `--col flex aic`, children: value });
};
export default TColumn;
