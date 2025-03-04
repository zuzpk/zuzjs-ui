"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useAnchorPosition, useBase } from "../../hooks";
import { TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import MenuItem from "./item";
// import { dynamicObject } from "../../types";
const ContextMenu = forwardRef((props, ref) => {
    const { as, offsetX, offsetY, parent, items: _items, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const event = useRef(undefined);
    const [visible, setVisible] = useState(false);
    // const [_position, setPosition] = useState<{ x: number, y: number } | null>(null);
    // const [_parent, setParent] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [items, setItems] = useState(_items || []);
    const { position, targetRef } = useAnchorPosition(parent, event.current, { offsetX, offsetY });
    useImperativeHandle(ref, () => ({
        show: (e, menuItems) => {
            if (!parent)
                event.current = e;
            if (menuItems) {
                setItems(menuItems);
            }
            setVisible(true);
        },
        hide: (e) => setVisible(false),
    }));
    return _jsx(Box, { className: `--contextmenu abs flex cols ${className}`.trim(), "aria-hidden": !visible, style: {
            ...style,
            top: position.top,
            left: position.left
        }, animate: {
            from: { opacity: 0, y: 20 },
            to: { opacity: 1, y: 0 },
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.05,
            when: visible
        }, ref: targetRef, ...rest, children: items.map((item, index) => _jsx(MenuItem, { ...{ ...item, index } }, `context-${item.label.toLowerCase()}-${index}`)) });
});
ContextMenu.displayName = `ContextMenu`;
export default ContextMenu;
