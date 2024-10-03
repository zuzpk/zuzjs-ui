import { createElement, forwardRef } from "react";
import { css, cleanProps } from "../funs";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
const With = forwardRef(({ tag, as, animate, className, propsToRemove, style, ...rest }, ref) => {
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
