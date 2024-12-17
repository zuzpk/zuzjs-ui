import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import Button from "../Button";
import Box from "../Box";
const SegmentItem = ({ onSelect, meta, selected }) => {
    const ref = useRef(null);
    const { index, icon, label } = meta;
    const [pos, setPos] = useState({ x: 0, width: 0 });
    // const [ _initial, setInitial ] = useState(true)
    useEffect(() => {
        if (ref.current) {
            const { width, x } = ref.current.getBoundingClientRect();
            setPos({ x, width });
        }
        // else
        //     setInitial(false)
    }, [ref.current]);
    useEffect(() => {
        if (selected) {
            onSelect(index, pos.width, pos.x, meta);
        }
    }, [selected]);
    return _jsxs(Button, { onClick: () => onSelect(index, pos.width, pos.x, meta), ref: ref, className: `--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim(), children: [icon && _jsx(Box, { className: `--segment-icon ${icon instanceof String ? `icon-${icon}` : `flex aic jcc`}`, children: typeof icon !== `string` && icon }), label && label.trim() != `` && _jsx(Box, { className: `--segment-label`, children: label || `Item ${index}` })] });
};
export default SegmentItem;
