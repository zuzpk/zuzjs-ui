import { ComponentPropsWithoutRef, createElement, ElementType, forwardRef, Ref } from "react";
import { css, cleanProps } from "../funs";
import { nanoid } from "nanoid";
import { dynamicObject } from "../types";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
import { TRANSITION_CURVES, TRANSITIONS } from "../types/enums";

export interface animationProps {
    transition?: TRANSITIONS,
    from?: dynamicObject;
    to?: dynamicObject;
    when?: boolean;
    duration?: number;
    delay?: number;
    curve?: string | TRANSITION_CURVES;
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

    const { transition, from, to, when, duration, delay, curve } = animate || {};

    let _style : dynamicObject = {};
    const _transition : dynamicObject = transition || (from && to) ? { transition: `all ${duration || `0.2`}s ${getAnimationCurve(curve)} ${delay || 0}s` } : {}

    if ( undefined === when ){
        _style = transition ? getAnimationTransition(transition, true) : { ...from, ...to }
    }else if ( true === when ){
        _style = transition ? getAnimationTransition(transition, false) : { ...(to || {}) }
    }
    else {
        _style = transition ? getAnimationTransition(transition, false, true) : from || {};
    }

    // console.log(`as`, as, cx)
    // console.log(`cx`, cx)

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