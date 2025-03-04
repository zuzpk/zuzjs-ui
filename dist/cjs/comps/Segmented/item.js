import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDelayed } from "../..";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
const SegmentItem = ({ onSelect, meta, selected }) => {
    const ref = useRef(null);
    const { index, icon, label } = meta;
    const [pos, setPos] = useState({ x: 0, width: 0 });
    const hydrated = useDelayed();
    useLayoutEffect(() => {
        if (hydrated && ref.current) {
            const { width, x } = ref.current.getBoundingClientRect();
            setPos({ x, width });
            if (selected) {
                onSelect(index, width, x, meta, true);
            }
        }
    }, [hydrated, ref.current]);
    useEffect(() => {
        if (selected) {
            onSelect(index, pos.width, pos.x, meta, false);
        }
    }, [selected]);
    return _jsxs(Button, { onClick: () => onSelect(index, pos.width, pos.x, meta, false), ref: ref, className: `--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim(), children: [icon ?
                `string` == typeof icon ? _jsx(Icon, { name: icon, as: `--segment-icon` }) : _jsx(Box, { as: `--segment-icon flex aic jcc`, children: icon })
                : null, label && String(label).trim() != `` && _jsx(Box, { className: `--segment-label`, children: label || `Item ${index}` })] });
};
SegmentItem.displayName = `SelectTabItem`;
export default SegmentItem;
