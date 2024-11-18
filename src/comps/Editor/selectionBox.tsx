// SelectionBox.tsx
import React, { useState, useCallback } from 'react';
import './styles.scss';
import { SelectionProps } from './types';

const SelectionBox = (props : SelectionProps) => {

    const [rect, setRect] = useState(props || { x: 10, y: 10, width: 200, height: 150 });

    const handleMouseDown = useCallback((e: React.MouseEvent<SVGCircleElement>, position: string) => {
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = rect.width;
        const startHeight = rect.height;

        const handleMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            setRect((prevRect) => {
                let newWidth = startWidth;
                let newHeight = startHeight;

                if (position.includes('right')) {
                    newWidth = startWidth + deltaX;
                } else if (position.includes('left')) {
                    newWidth = startWidth - deltaX;
                    prevRect.x += deltaX;
                }

                if (position.includes('bottom')) {
                    newHeight = startHeight + deltaY;
                } else if (position.includes('top')) {
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

    return (
        <svg className="selection-box" width="100%" height="100%">
            <rect className="selection-rect" x={rect.x} y={rect.y} width={rect.width} height={rect.height} />
            <circle className="handle" cx={rect.x} cy={rect.y} r="5" onMouseDown={(e) => handleMouseDown(e, 'top-left')} />
            <circle className="handle" cx={rect.x + rect.width / 2} cy={rect.y} r="5" onMouseDown={(e) => handleMouseDown(e, 'top')} />
            <circle className="handle" cx={rect.x + rect.width} cy={rect.y} r="5" onMouseDown={(e) => handleMouseDown(e, 'top-right')} />
            <circle className="handle" cx={rect.x} cy={rect.y + rect.height / 2} r="5" onMouseDown={(e) => handleMouseDown(e, 'left')} />
            <circle className="handle" cx={rect.x + rect.width} cy={rect.y + rect.height / 2} r="5" onMouseDown={(e) => handleMouseDown(e, 'right')} />
            <circle className="handle" cx={rect.x} cy={rect.y + rect.height} r="5" onMouseDown={(e) => handleMouseDown(e, 'bottom-left')} />
            <circle className="handle" cx={rect.x + rect.width / 2} cy={rect.y + rect.height} r="5" onMouseDown={(e) => handleMouseDown(e, 'bottom')} />
            <circle className="handle" cx={rect.x + rect.width} cy={rect.y + rect.height} r="5" onMouseDown={(e) => handleMouseDown(e, 'bottom-right')} />
        </svg>
    );
};

export default SelectionBox;