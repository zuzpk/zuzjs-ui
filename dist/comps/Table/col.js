import { jsx as _jsx } from "react/jsx-runtime";
import Box from "../Box";
const TColumn = (props) => {
    const { idx, id, as, weight, style, value, render, resize, sort } = props;
    return _jsx(Box, { style: {
            flex: weight || 1,
            ...style
        }, as: `--col flex aic ${as || ``}`, children: value });
};
export default TColumn;
