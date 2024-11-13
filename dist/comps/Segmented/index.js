import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import SegmentItem from "./item";
/**
 * `SelectTabs` component is a segmented control that allows switching between segments.
 *
 * @component
 * @param {SegmentProps} props - Props for the segmented control component.
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the root div element.
 * @returns {JSX.Element} The rendered segmented control.
 *
 * @example
 * // Usage example
 * const segments = [
 *   { index: 0, label: "Home", icon: "home_icon" },
 *   { index: 1, label: "Profile", icon: "profile_icon" },
 *   { index: 2, label: "Settings", icon: "settings_icon" }
 * ];
 *
 * <SelectTabs selected={1} items={segments} />
 */
const Segmented = forwardRef((props, ref) => {
    const { animate, items, selected, onSwitch, ...pops } = props;
    const [_selected, setSelected] = useState(selected || 0);
    const { className, style, rest } = useBase(pops);
    const _tab = useRef(null);
    const _segmented = useRef(null);
    /**
     * Handles selection of a segment.
     *
     * @param {number} index - The index of the selected segment.
     * @param {number} width - The width of the selected segment.
     * @param {number} x - The x-coordinate of the selected segment.
     */
    const handleSelect = (index, width, x, meta) => {
        setSelected(index);
        if (_tab.current) {
            const _sp = _segmented.current?.getBoundingClientRect();
            _tab.current.style.setProperty(`--w`, `${width}px`);
            _tab.current.style.setProperty(`--x`, `${_sp ? x - _sp.left : x}px`);
            if (onSwitch)
                onSwitch(meta);
        }
    };
    useEffect(() => { }, []);
    return _jsxs(Box, { ref: _segmented, className: `${className} --segmented flex aic rel`, style: style, ...rest, children: [_jsx(Box, { ref: _tab, className: `--segment-tab abs` }), items.map((item, i) => _jsx(SegmentItem, { onSelect: handleSelect, selected: _selected == i, meta: {
                    ...item,
                    index: i
                } }, `segment-${item.label}-${i}`))] });
});
export default Segmented;
