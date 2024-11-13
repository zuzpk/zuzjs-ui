import { ComponentPropsWithoutRef, ElementType } from "react"
import { SHIMMER, SORT } from "./enums"
import { animationProps, Skeleton } from "./interfaces"

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

export type zuzProps = `as` | `css` | `hover` | `before` | `after`

export interface ZuzProps {
    /** Defines the React element or HTML tag to render */
    // tag?: T;

    /** CSS Styles, such as "w:100" for "width: 100px"; */
    as?: string | string[];

    /** Animation configuration using {@link animationProps} */
    animate?: animationProps;

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
}

export type Attach<T, U> = Omit<T, keyof U> & U

export type BaseProps<T extends keyof JSX.IntrinsicElements> = ComponentPropsWithoutRef<T>

// export type Props<T extends keyof JSX.IntrinsicElements> = BaseProps<T> & ZuzProps<T>
export type Props<T extends ElementType> = ZuzProps & Omit<ComponentPropsWithoutRef<T>, keyof ZuzProps>;

export type FormInputs = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement