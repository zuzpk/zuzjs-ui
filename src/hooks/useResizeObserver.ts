import { useState, useEffect, useRef, RefObject } from 'react';

interface Size {
    width: number;
    height: number;
}

const useResizeObserver = (ref: RefObject<HTMLElement | null>): Size => {
    
    const [size, setSize] = useState<Size>({ width: 0, height: 0 });

    useEffect(() => {
        const handleResize = (entries: ResizeObserverEntry[]) => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                setSize({ width, height });
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