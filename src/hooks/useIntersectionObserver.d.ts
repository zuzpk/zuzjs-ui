import { RefObject } from 'react';
interface IntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}
declare const useIntersectionObserver: (refs: RefObject<HTMLElement | null>[], options?: IntersectionObserverOptions) => number[];
export default useIntersectionObserver;
