import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Box from "../Box";
const SegmentItem = ({ onSelect, meta, selected }) => {
    const ref = useRef(null);
    const { index, icon, label } = meta;
    const [pos, setPos] = useState({ x: 0, width: 0 });
    useEffect(() => {
        if (ref.current) {
            const { width, x } = ref.current.getBoundingClientRect();
            setPos({ x, width });
        }
        if (selected) {
            onSelect(index, pos.width, pos.x, meta);
        }
    }, [ref.current]);
    return _jsxs(Button, { onClick: () => onSelect(index, pos.width, pos.x, meta), ref: ref, className: `--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim(), children: [icon && _jsx(Box, { className: `--segment-icon icon-${icon}` }), _jsx(Box, { className: `--segment-label`, children: label || `Item ${index}` })] });
};
export default SegmentItem;
