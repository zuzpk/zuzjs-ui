import { ComponentPropsWithoutRef, createElement, ElementType, forwardRef, Ref } from "react";
import { css, cleanProps } from "../funs";
import { 
    dynamicObject,
} from "../types";
// import { 
//     BaseProps as _BaseProps,
// } from "../types/interfaces";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
import { TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
import { Skeleton } from "../types/interfaces";

export interface animationProps {
    transition?: TRANSITIONS,
    from?: dynamicObject;
    to?: dynamicObject;
    when?: boolean;
    duration?: number;
    delay?: number;
    curve?: string | TRANSITION_CURVES;
}

interface BaseProps<T extends ElementType>{
    tag?: T
    as?: string | string[]
    animate?: animationProps
    className?: string
    propsToRemove?: string[]
    skeleton?: Skeleton
}

export type Props<T extends ElementType> = BaseProps<T> & ComponentPropsWithoutRef<T>;

const buildSkeletonStyle = (s: Skeleton) : dynamicObject => {

    const makeValue = (v?: number | string, unit: string = `px`) : string => {
        return v ? 
            `string` == typeof v ? v  :`${v}${unit}`
            : `inherit`
    }

    const style : dynamicObject = {}

    if ( s.radius ){
        style.borderRadius = makeValue(s.radius)
    }

    if ( s.size ){
        style.width = style.minWidth = style.maxWidth = style.height = style.minHeight = style.maxHeight = makeValue(s.size)
    }
    else if ( s.width || s.height ) {
        if ( s.width ) {
            style.width = style.minWidth = style.maxWidth = makeValue(s.width)
        }
        if ( s.height ) {
            style.height = style.minHeight = style.maxHeight = makeValue(s.height)
        }
    }
    else {
        style.minWidth = style.minHeight = `100%`
    }
        
    return style
}

const With = forwardRef(<T extends ElementType = 'div'>(
    {
        tag,
        as,
        animate,
        className,
        propsToRemove,
        style,
        skeleton,
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

    const { children, ...restProps } = cleanProps(rest, propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`])

    return createElement(Comp, {
        style: {
            ...buildWithStyles(_style),
            ..._transition,
            ...style,
            ...(skeleton?.enabled? buildSkeletonStyle(skeleton) : {})
        },
        className: [
            className, 
            ...cx,
            skeleton?.enabled ? `--skeleton` : ``
        ].join(' ').trim(),
        children: skeleton?.enabled ? ` `.repeat(6)
            // createElement(`div`, {
            // className: [ `--skeleton-body` ],
            // dangerouslySetInnerHTML: { __html: `&nbsp;`.repeat(6) }
            // }) 
        : children,
        ...restProps,
        ref
    });

});

export default With;