import { useState, useEffect } from 'react';
const useIntersectionObserver = (refs, options = {}) => {
    const [intersectionRatio, setIntersectionRatio] = useState(refs && refs.length > 0 ? new Array(refs.length).fill(0) : []);
    useEffect(() => {
        if (!refs || !refs.length)
            return;
        const observer = new IntersectionObserver((entries) => {
            requestAnimationFrame(() => {
                setIntersectionRatio(prev => {
                    const newRatios = [...prev];
                    let hasChanges = false;
                    entries.forEach(entry => {
                        const index = refs.findIndex(ref => ref.current === entry.target);
                        if (index !== -1 && newRatios[index] !== entry.intersectionRatio) {
                            newRatios[index] = entry.intersectionRatio;
                            hasChanges = true;
                        }
                    });
                    return hasChanges ? newRatios : prev;
                });
            });
        }, { rootMargin: '200px', threshold: [1], ...options });
        refs.forEach(ref => {
            if (ref.current) {
                observer.observe(ref.current);
            }
        });
        return () => {
            refs.forEach(ref => {
                if (ref.current) {
                    observer.unobserve(ref.current);
                }
            });
        };
    }, [refs, options]);
    return intersectionRatio;
};
export default useIntersectionObserver;
