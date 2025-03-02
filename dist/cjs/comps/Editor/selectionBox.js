import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// SelectionBox.tsx
import { useState, useCallback } from 'react';
import './styles.scss';
const SelectionBox = (props) => {
    const [rect, setRect] = useState(props || { x: 10, y: 10, width: 200, height: 150 });
    const handleMouseDown = useCallback((e, position) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = rect.width;
        const startHeight = rect.height;
        const handleMouseMove = (moveEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;
            setRect((prevRect) => {
                let newWidth = startWidth;
                let newHeight = startHeight;
                if (position.includes('right')) {
                    newWidth = startWidth + deltaX;
                }
                else if (position.includes('left')) {
                    newWidth = startWidth - deltaX;
                    prevRect.x += deltaX;
                }
                if (position.includes('bottom')) {
                    newHeight = startHeight + deltaY;
                }
                else if (position.includes('top')) {
                    newHeight = startHeight - deltaY;
                    prevRect.y += deltaY;
                }
                return {
                    ...prevRect,
                    width: newWidth,
                    height: newHeight,
                };
            });
        };
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [rect]);
    return (_jsxs("svg", { className: "selection-box", width: "100%", height: "100%", children: [_jsx("rect", { className: "selection-rect", x: rect.x, y: rect.y, width: rect.width, height: rect.height }), _jsx("circle", { className: "handle", cx: rect.x, cy: rect.y, r: "5", onMouseDown: (e) => handleMouseDown(e, 'top-left') }), _jsx("circle", { className: "handle", cx: rect.x + rect.width / 2, cy: rect.y, r: "5", onMouseDown: (e) => handleMouseDown(e, 'top') }), _jsx("circle", { className: "handle", cx: rect.x + rect.width, cy: rect.y, r: "5", onMouseDown: (e) => handleMouseDown(e, 'top-right') }), _jsx("circle", { className: "handle", cx: rect.x, cy: rect.y + rect.height / 2, r: "5", onMouseDown: (e) => handleMouseDown(e, 'left') }), _jsx("circle", { className: "handle", cx: rect.x + rect.width, cy: rect.y + rect.height / 2, r: "5", onMouseDown: (e) => handleMouseDown(e, 'right') }), _jsx("circle", { className: "handle", cx: rect.x, cy: rect.y + rect.height, r: "5", onMouseDown: (e) => handleMouseDown(e, 'bottom-left') }), _jsx("circle", { className: "handle", cx: rect.x + rect.width / 2, cy: rect.y + rect.height, r: "5", onMouseDown: (e) => handleMouseDown(e, 'bottom') }), _jsx("circle", { className: "handle", cx: rect.x + rect.width, cy: rect.y + rect.height, r: "5", onMouseDown: (e) => handleMouseDown(e, 'bottom-right') })] }));
};
export default SelectionBox;
