import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "../Box";
import TColumn from "./col";
const TRow = (props) => {
    const { index, schema, data, ids, styles } = props;
    return _jsxs(Box, { as: `--row flex aic ${index == -1 ? `--row-head` : ``}`, children: [index == -1 && schema.map((c, i) => _jsx(TColumn, { idx: -1, ...c, style: styles[c.id] }, `--col-${c.id}`)), index > -1 && ids && data && Object.keys(data).map((k, i) => {
                const _item = schema.find(s => s.id == k);
                // const style = {
                //     ...(_item?.w && { width: _item.w }),
                //     ...(_item?.maxW && { maxWidth: _item.maxW }),
                //     ...(_item?.minW && { minWidth: _item.minW }),
                //     ...(_item?.h && { height: _item.h }),
                //     ...(_item?.maxH && { maxHeight:_item.maxH }),
                //     ...(_item?.minH && { minHeight: _item.minH }),
                // }
                return ids.includes(k) ? _jsx(TColumn, { idx: i, id: k, style: styles[k], value: _item?.render ? _item?.render(data) : data[k] }, `--${k}-val-${i}`) : null;
            })] });
};
export default TRow;
