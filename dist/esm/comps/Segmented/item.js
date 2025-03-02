import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
const SegmentItem = ({ onSelect, meta, selected }) => {
    const ref = useRef(null);
    const { index, icon, label } = meta;
    const [pos, setPos] = useState({ x: 0, width: 0 });
    // const [ _selected, setSelected ] = useState(selected)
    useEffect(() => {
        if (ref.current) {
            const { width, x } = ref.current.getBoundingClientRect();
            setPos({ x, width });
            if (selected) {
                onSelect(index, width, x, meta, true);
                // setSelected(meta.index)
            }
            // if ( selected && !_initial ){
            //     ref.current.click()
            //     setInitial(true)
            // }
        }
        // else
        //     setInitial(false)
    }, [ref.current]);
    useEffect(() => {
        if (selected) {
            onSelect(index, pos.width, pos.x, meta, false);
        }
    }, [selected]);
    return _jsxs(Button, { onClick: () => onSelect(index, pos.width, pos.x, meta, false), ref: ref, 
        // data-x={pos.x}
        suppressHydrationWarning: true, className: `--segment-item flex aic rel ${selected ? `--segement-active` : ``}`.trim(), children: [icon ?
                `string` == typeof icon ? _jsx(Icon, { name: icon, as: `--segment-icon` }) : _jsx(Box, { as: `--segment-icon flex aic jcc`, children: icon })
                : null, label && String(label).trim() != `` && _jsx(Box, { className: `--segment-label`, children: label || `Item ${index}` })] });
};
export default SegmentItem;
