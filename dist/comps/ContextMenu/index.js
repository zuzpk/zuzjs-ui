import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box from "../Box";
import { useBase } from "../../hooks";
import MenuItem from "./item";
const ContextMenu = forwardRef((props, ref) => {
    const { as, items, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    useImperativeHandle(ref, () => ({
        show: (e) => {
            // console.log(e)
            if (e instanceof MouseEvent) {
                setPosition({ x: e.clientX, y: e.clientY });
            }
            else if (e instanceof TouchEvent && e.touches.length > 0) {
                setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
            }
            else {
                const { clientX: x, clientY: y } = e;
                setPosition({ x, y });
            }
            setVisible(true);
        },
        hide: (e) => setVisible(false),
    }));
    useEffect(() => { }, [visible, position]);
    if (!visible)
        return null;
    return _jsx(Box, { className: `--contextmenu abs flex cols ${className}`.trim(), style: {
            ...style,
            top: position.y,
            left: position.x
        }, ...rest, children: items.map((item, index) => _jsx(MenuItem, { ...{ ...item, index } }, `context-${item.label.toLowerCase()}-${index}`)) });
});
export default ContextMenu;
