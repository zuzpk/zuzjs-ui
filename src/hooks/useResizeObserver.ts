import { useState, useEffect, useRef, RefObject } from 'react';

interface Size {
    width: number;
    height: number;
    top: number;
    left: number;
}

const useResizeObserver = (ref: RefObject<HTMLElement | null>): Size => {
    
    const [size, setSize] = useState<Size>({ width: 0, height: 0, top: 0, left: 0 });

    useEffect(() => {
        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (let entry of entries) {
                const { width, height, top, left } = entry.contentRect;
                setSize({ width, height, top, left });
            }
        };

        const resizeObserver = new ResizeObserver(handleResize);
        if (ref.current) {
            resizeObserver.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                resizeObserver.unobserve(ref.current);
            }
        };
    }, [ref]);

    return size;
};

export default useResizeObserver;