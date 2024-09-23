import { ComponentPropsWithoutRef, createElement, ElementType, forwardRef, Ref } from "react";
import { css, cleanProps } from "../funs";
import { nanoid } from "nanoid";
import { dynamicObject } from "../types";

interface BaseProps<T extends ElementType> {
    tag?: T;
    as?: string | string[];
    className?: string;
    propsToRemove?: string[];
}

export type Props<T extends ElementType> = BaseProps<T> & ComponentPropsWithoutRef<T>;

const With = forwardRef(<T extends ElementType = 'div'>(
    {
        tag,
        as,
        className,
        propsToRemove,
        ...rest
    }: Props<T>,
    ref: Ref<Element>
) => {

    const Comp = tag || 'div';
    let cx : string[] = []
    if ( as ){
        cx = css().Build(`string` == typeof as ? as : as.join(` `)).cx;
    }

    return createElement(Comp, {
        // id: cx.join(` `),
        className: [className, ...cx].join(' ').trim(),
        ...cleanProps(rest, propsToRemove || []),
        ref
    });

});

export default With;