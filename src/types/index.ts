import { ComponentPropsWithoutRef, ElementType } from "react";
import { DragOptions } from "../hooks";
import { SHIMMER, SORT, TRANSITIONS } from "./enums";
import { animationProps, Skeleton } from "./interfaces";

export type Deprecated<T, M extends string> = T & { __deprecatedMessage?: M };

export type dynamic = { 
    [x: string] : any 
}

export type dynamicObject = { 
    [x: string] : any 
}

export type stringObject = { 
    [x: string] : string
}

export type sortOptions = {
    direction?: SORT,
    caseSensitive?: boolean,
}

export type KeyBindings = {
    [key: string]: () => void;
};

export interface FormatNumberParams {
    number: number | string
    locale: string
    style?: `decimal` | `currency` | `percent`,
    decimal?: number,
    currency?: {
        code: string
        style: `symbol` | `code` | `name`
        symbol?: string
    }
}

export type CalendarWeekdayFormat = "long" | "short" | "narrow"
export type CalendarMonthFormat = CalendarWeekdayFormat | "numeric" | "2-digit"

export type zuzProps = `as` | `css` | `hover` | `before` | `after`

export interface ZuzProps {
    /** When true, exposes itself to ZuzBuilder (Editor) */
    withEditor?: boolean;

    /** CSS Styles, such as "w:100" for "width: 100px"; */
    as?: string | string[];

    /** 
     * @deprecated
     * Use `fx`.
     * Animation configuration using {@link animationProps} 
     * */
    animate?: animationProps;

    /** Animation configuration using {@link animationProps} */
    fx?: animationProps;

    transition?: TRANSITIONS,

    /** Skeleton placeholder configuration using {@link Skeleton} */
    skeleton?: Skeleton;

    /** Additional class names for styling the component */
    className?: string;

    /** Shimmer effect for loading state, using predefined {@link SHIMMER} options */
    shimmer?: SHIMMER;

    /** Props to remove after processing so it won't appear in DOM */
    propsToRemove?: string[];

    /** Makes Component Draggable */
    draggable?: boolean;

    dragOptions?: DragOptions;
}

export type Attach<T, U> = Omit<T, keyof U> & U

export type Props<T extends ElementType> = ZuzProps & Omit<ComponentPropsWithoutRef<T>, keyof ZuzProps>;

export type FormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

export type cssShortKey = keyof cssShortKeys
export type cssShortKeys = {
    w: string | number,
    minW: string | number,
    maxW: string | number,
    h: string | number,
    minH: string | number,
    maxH: string | number,
    x: string | number,
    y: string | number,
    z: string | number,
    r: string | number,
    rx: string | number,
    ry: string | number,
    rz: string | number,
    s: string | number,
    sx: string | number,
    sy: string | number,
    sz: string | number,
};

