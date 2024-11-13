import { useRef, useState, useEffect } from 'react';

interface Position {
    x: number;
    y: number;
}

const useDrag = () => {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
    const isDragging = useRef(false);
    const dragStart = useRef<Position>({ x: 0, y: 0 });
    const wasDragged = useRef(false);

    const onMouseDown = (event: React.MouseEvent) => {
        isDragging.current = true;
        wasDragged.current = false;  // Reset drag flag on mouse down
        dragStart.current = {
            x: event.clientX - position.x,
            y: event.clientY - position.y
        };

        // Prevent text selection during dragging
        event.preventDefault();
    };

    const onMouseMove = (event: MouseEvent) => {
        if (!isDragging.current) return;

        const newX = event.clientX - dragStart.current.x;
        const newY = event.clientY - dragStart.current.y;

        // Set `wasDragged` to true if the mouse has moved from the starting position
        if (Math.abs(newX - position.x) > 1 || Math.abs(newY - position.y) > 1) {
            wasDragged.current = true;
        }

        setPosition({ x: newX, y: newY });
    };

    const onMouseUp = () => {
        isDragging.current = false;
    };

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };
    }, []);

    return {
        position,
        onMouseDown,
        isDragging: wasDragged.current
    };
};

export default useDrag