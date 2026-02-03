import { ElementType, ComponentPropsWithoutRef } from 'react';
import { ZuzProps } from './interfaces';
import { COLORTHEME, SKELETON } from './enums';
export type dynamic = {
    [x: string]: any;
};
export type Props<T extends ElementType> = ZuzProps & Omit<ComponentPropsWithoutRef<T>, keyof ZuzProps>;
export type SkeletonType = typeof SKELETON[keyof typeof SKELETON];
export type ColorTheme = typeof COLORTHEME[keyof typeof COLORTHEME];
