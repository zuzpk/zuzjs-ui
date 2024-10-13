import { RefObject } from 'react';
interface IntersectionObserverOptions {
    root?: Element | null;
    rootMargin?: string;
    threshold?: number | number[];
}
declare const useIntersectionObserver: (ref: RefObject<HTMLElement | null>, options?: IntersectionObserverOptions) => number;
export default useIntersectionObserver;
