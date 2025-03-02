import { useState, useEffect } from 'react';
const useResizeObserver = (ref) => {
    const [size, setSize] = useState({ width: 0, height: 0, top: 0, left: 0 });
    useEffect(() => {
        const handleResize = (entries) => {
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
