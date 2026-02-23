import {
    ComponentPropsWithoutRef,
    ElementType
} from 'react';
import { ZuzProps } from './interfaces';

/**
 * Converts a "const object" into a union of its values.
 * Equivalent to: typeof Obj[keyof typeof Obj]
 */
export type ValueOf<T> = T[keyof T];

export type dynamic = { 
    [x: string] : any 
}

export type Props<T extends ElementType> = ZuzProps & Omit<ComponentPropsWithoutRef<T>, keyof ZuzProps>;

export type FormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type AnimationTransition = `back` | `expo` | `sine` | `power` | `circ` | `bounce` | `elastic` | `ease` | `spring` | `liquid`