import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDelayed } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
const SegmentItem = ({ onSelect, meta, selected }) => {
    const ref = useRef(null);
    const { index, icon, label } = meta;
    const [pos, setPos] = useState({ x: 0, width: 0 });
    const hydrated = useDelayed();
    // const observer = useResizeObserver(ref)
    useLayoutEffect(() => {
        if (hydrated && ref.current) {
            const { width, x } = ref.current.getBoundingClientRect();
            // const { width, left } =  observer
            // console.log(pos, { x: left, width })
            setPos({ x, width });
            if (selected) {
                onSelect(index, width, x, meta, true);
            }
            // else if ( pos.x != left || pos.width != width ){
            //     // console.log(`re-triggered`)
            //     setPos({ x: left, width })
            //     onSelect(-2, width, left, meta, false)
            // }
            // console.log(`hydrated`, index, width, x, observer)
        }
    }, [hydrated, ref.current]);
    useEffect(() => {
        if (selected) {
            onSelect(index, pos.width, pos.x, meta, false);
        }
    }, [selected]);
    return _jsxs(Button, { onClick: () => onSelect(index, pos.width, pos.x, meta, false), ref: ref, className: `--segment-item flex aic rel ${selected ? `--segment-active` : ``}`.trim(), children: [icon ?
                `string` == typeof icon ? _jsx(Icon, { name: icon, as: `--segment-icon` }) : _jsx(Box, { as: `--segment-icon flex aic jcc`, children: icon })
                : null, label && String(label).trim() != `` && _jsx(Box, { className: `--segment-label`, children: label || `Item ${index}` })] });
};
SegmentItem.displayName = `SelectTabItem`;
export default SegmentItem;
