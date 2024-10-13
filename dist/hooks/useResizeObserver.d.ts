import { RefObject } from 'react';
interface Size {
    width: number;
    height: number;
}
declare const useResizeObserver: (ref: RefObject<HTMLElement | null>) => Size;
export default useResizeObserver;
