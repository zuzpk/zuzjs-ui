import { ReactNode } from "react";
import { BoxProps } from "../../types";

export type CarouselEffect = 'slide' | 'coverflow' | 'fade' | 'stack';

export type LoopMode = 'jump' | 'infinite';

export type CarouselProps<T> = BoxProps & {
    items: T[];
    renderItem: (item: T, index: number, activeIndex: number) => ReactNode;
    effect?: CarouselEffect;
    loop?: boolean;
    loopMode?: LoopMode,
    startIndex?: number,
    useKeys?: boolean;
    useWheel?: boolean;
    spacing?: number;
    rotation?: number;
    scaleStep?: number;
    autoPlay?: boolean;
    autoPlaySpeed?: number;
    showDots?: boolean;
    onChange?: (index: number) => void;
};