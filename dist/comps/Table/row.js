import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import Box from "../Box";
import TColumn from "./col";
import { TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import { useDelayed } from "../../hooks";
const TRow = (props) => {
    const { index, schema, data, ids, styles, animate } = props;
    const mounted = useDelayed();
    const _animation = useMemo(() => ({
        transition: TRANSITIONS.SlideInBottom,
        curve: TRANSITION_CURVES.EaseInOut,
        delay: .02 * (index + 1),
    }), []);
    return _jsxs(Box, { ...(animate ? { animate: { ..._animation, when: mounted } } : {}), as: `--row flex aic ${index == -1 ? `--row-head` : ``}`, children: [index == -1 && schema.map((c, i) => _jsx(TColumn, { idx: -1, ...c, style: styles[c.id] }, `--col-${c.id}`)), index > -1 && ids && data && schema.map((c, i) => {
                return ids.includes(String(c.id)) ? _jsx(TColumn, { idx: i, id: String(c.id), style: styles[String(c.id)], value: c.render ? c.render(data) : data[String(c.id)] }, `--${String(c.id)}-val-${i}`) : null;
            })] });
};
export default TRow;
