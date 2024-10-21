import { createElement, forwardRef } from "react";
import { css, cleanProps } from "../funs";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
const buildSkeletonStyle = (s) => {
    const makeValue = (v, unit = `px`) => {
        return v ?
            `string` == typeof v ? v : `${v}${unit}`
            : `inherit`;
    };
    const style = {};
    if (s.radius) {
        style.borderRadius = makeValue(s.radius);
    }
    if (s.size) {
        style.width = style.minWidth = style.maxWidth = style.height = style.minHeight = style.maxHeight = makeValue(s.size);
    }
    else if (s.width || s.height) {
        if (s.width) {
            style.width = style.minWidth = style.maxWidth = makeValue(s.width);
        }
        if (s.height) {
            style.height = style.minHeight = style.maxHeight = makeValue(s.height);
        }
    }
    else {
        style.minWidth = style.minHeight = `100%`;
    }
    return style;
};
const With = forwardRef(({ tag, as, animate, className, propsToRemove, style, skeleton, ...rest }, ref) => {
    const Comp = tag || 'div';
    let cx = [];
    if (as) {
        cx = css().Build(`string` == typeof as ? as : as.join(` `)).cx;
    }
    const { transition, from, to, when, duration, delay, curve } = animate || {};
    let _style = {};
    const _transition = transition || (from && to) ? { transition: `all ${duration || `0.2`}s ${getAnimationCurve(curve)} ${delay || 0}s` } : {};
    if (undefined === when) {
        _style = transition ? getAnimationTransition(transition, true) : { ...from, ...to };
    }
    else if (true === when) {
        _style = transition ? getAnimationTransition(transition, false) : { ...(to || {}) };
    }
    else {
        _style = transition ? getAnimationTransition(transition, false, true) : from || {};
    }
    const { children, ...restProps } = cleanProps(rest, propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]);
    return createElement(Comp, {
        style: {
            ...buildWithStyles(_style),
            ..._transition,
            ...style,
            ...(skeleton?.enabled ? buildSkeletonStyle(skeleton) : {})
        },
        className: [
            className,
            ...cx,
            skeleton?.enabled ? `--skeleton` : ``
        ].join(' ').trim(),
        children: skeleton?.enabled ? ` `.repeat(6)
            : children,
        ...restProps,
        ref
    });
});
export default With;
