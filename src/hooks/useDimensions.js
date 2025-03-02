import { useState, useEffect } from 'react';
const useDimensions = (el) => {
    const [dims, setDims] = useState({
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        x: 0,
        y: 0
    });
    const update = () => {
        if (el) {
            const { width, height, top, left, bottom, right, x, y } = el.getBoundingClientRect();
            setDims({
                width,
                height,
                top,
                left,
                bottom,
                right,
                x,
                y
            });
        }
        else {
            setDims({
                width: window.innerWidth,
                height: window.innerHeight,
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                x: 0,
                y: 0
            });
        }
    };
    useEffect(() => {
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);
    return dims;
};
export default useDimensions;
