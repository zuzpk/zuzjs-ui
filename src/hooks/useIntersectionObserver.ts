import { useState, useEffect, RefObject } from 'react';

interface IntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}

const useIntersectionObserver = (
    ref: RefObject<HTMLElement | null>,
    options: IntersectionObserverOptions = {}
): number => {
    const [intersectionRatio, setIntersectionRatio] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                setIntersectionRatio(entry.intersectionRatio);
            });
        }, options);

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [ref, options]);

    return intersectionRatio;
};

export default useIntersectionObserver;