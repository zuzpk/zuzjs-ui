"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Box from "../Box";
import { useBase } from "../../hooks";
import ActionItem from "./item";
import { Position } from "../../types/enums";
/**
 * ActionBar renders a list of buttons with tooltips.
 *
 * @example
 * ```tsx
 * const items = [
 *   { label: 'Edit', icon: <EditIcon />, onClick: () => console.log('Edit clicked') },
 *   { label: 'Delete', icon: <DeleteIcon />, onClick: () => console.log('Delete clicked') }
 * ];
 *
 * <ActionBar items={items} />
 * ```
 */
const ActionBar = forwardRef((props, ref) => {
    const { items, name, selected, position, ...pops } = props;
    const self = useRef(null);
    const [_selected, setSelected] = useState(selected || items[0].tag || 0);
    const track = useCallback(({ x, y }) => {
        if (self.current) {
            const bounds = self.current.getBoundingClientRect();
            document.documentElement.style.setProperty(`--tip-x`, `${x - bounds.left}`);
            document.documentElement.style.setProperty(`--tip-y`, `${y - bounds.top}`);
            document.documentElement.style.setProperty(`--tip-s`, `1`);
        }
    }, []);
    const tear = useCallback(() => {
        if (self.current) {
            self.current.removeEventListener(`pointerleave`, tear);
            self.current.removeEventListener(`pointermove`, track);
            document.documentElement.style.setProperty(`--tip-s`, `0`);
        }
    }, []);
    const initTrack = useCallback(() => {
        if (self.current) {
            self.current.addEventListener(`pointerleave`, tear);
            self.current.addEventListener(`pointermove`, track);
        }
    }, []);
    useEffect(() => {
        if (self.current) {
            document.documentElement.style.setProperty(`--tip-w`, items.reduce((longest, item) => {
                return item.label.length > longest.length ? item.label : longest;
            }, '').length.toString());
            document.documentElement.style.setProperty(`--tip-s`, `0`);
            document.documentElement.style.setProperty(`--tip-l`, `${items.length}`);
            self.current?.addEventListener(`pointerenter`, initTrack);
        }
    }, []);
    const { className, style, rest } = useBase(pops);
    return _jsxs(Box, { ref: self, style: style, className: [
            `--actionbar flex aic ${className}`,
            `${!position || position == Position.Auto ? `rel` : `--${position}`}`
        ].join(` `).trim(), ...rest, children: [items.map((item, index) => _jsx(ActionItem, { selected: _selected === item.tag || selected == index, ...item, idx: index }, `actionbar-action-${item.label.toLowerCase().replace(/\s+/g, `-`)}`)), _jsx(Box, { className: `--tip abs`, children: _jsx(Box, { className: `--track flex aic`, children: items.map(({ label }) => _jsx(Box, { className: `--lb`, children: label }, `tool-tip-${label.toLowerCase().replace(/\s+/g, `-`)}`)) }) })] });
});
export default ActionBar;
