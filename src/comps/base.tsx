import { ComponentPropsWithoutRef, createElement, ElementType, forwardRef, Ref } from "react";
import { css, cleanProps } from "../funs";
import { nanoid } from "nanoid";
import { dynamicObject } from "../types";
import { buildWithStyles, getAnimationCurve } from "../funs/css";

export interface animationProps {
    from?: dynamicObject;
    to?: dynamicObject;
    when?: boolean;
    duration?: number;
    delay?: number;
    curve?: string;
}

interface BaseProps<T extends ElementType> {
    tag?: T;
    as?: string | string[];
    className?: string;
    propsToRemove?: string[];    
    animate?: animationProps
}

export type Props<T extends ElementType> = BaseProps<T> & ComponentPropsWithoutRef<T>;

const With = forwardRef(<T extends ElementType = 'div'>(
    {
        tag,
        as,
        animate,
        className,
        propsToRemove,
        style,
        ...rest
    }: Props<T>,
    ref: Ref<Element>
) => {

    const Comp = tag || 'div';
    let cx : string[] = []
    if ( as ){
        cx = css().Build(`string` == typeof as ? as : as.join(` `)).cx;
    }

    const { from, to, when, duration, delay, curve } = animate || {};

    let _style : dynamicObject = {};
    const _transition : dynamicObject = from && to ? { transition: `all ${duration || `0.2`}s ${getAnimationCurve(curve)} ${delay || 0}s` } : {}

    if ( undefined === when ){
        _style = { ...from, ...to }
    }else if ( true === when ){
        _style = { ...(to || {}) }
    }
    else {
        _style = from || {};
    }

    return createElement(Comp, {
        style: {
            ...buildWithStyles(_style),
            ..._transition,
            ...style
        },
        className: [className, ...cx].join(' ').trim(),
        ...cleanProps(rest, propsToRemove || []),
        ref
    });

});

export default With;