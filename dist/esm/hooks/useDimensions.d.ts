import { ReactNode } from 'react';
export interface Dimensions {
    width: number;
    height: number;
    top: number;
    left: number;
    bottom: number;
    right: number;
    x: number;
    y: number;
}
declare const useDimensions: (el?: HTMLElement | ReactNode) => Dimensions;
export default useDimensions;
