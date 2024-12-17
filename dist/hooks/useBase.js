import { cleanProps, css } from "../funs";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
import useDrag from "./useDrag";
import { cssFilterKeys, cssTransformKeys, cssWithKeys } from "../funs/stylesheet";
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
const useBase = (props) => {
    const { as, animate, skeleton, className, shimmer, propsToRemove, draggable, dragOptions, ...rest } = props || {};
    let cx = [];
    if (as) {
        cx = css().Build(`string` == typeof as ? as : as.join(` `)).cx;
    }
    const { transition, from, to, when, duration, delay, curve } = animate || {};
    let _style = {};
    if (undefined === when) {
        _style = transition ? getAnimationTransition(transition, true) : { ...from, ...to };
    }
    else if (true === when) {
        _style = transition ? getAnimationTransition(transition, false) : { ...(to || {}) };
    }
    else {
        _style = transition ? getAnimationTransition(transition, false, true) : from || {};
    }
    const _transition = {};
    if (transition || (from && to)) {
        // { transition: `all ${duration || `0.2`}s ${getAnimationCurve(curve)} ${delay || 0}s` }
        const _curve = getAnimationCurve(curve);
        const _transitionList = [];
        Object.keys(_style).forEach(ck => {
            let prop = ck;
            let _subTrans = ck;
            if (prop in cssWithKeys) {
                _subTrans = cssTransformKeys.includes(cssWithKeys[prop].toString()) ? `transform`
                    : cssFilterKeys.includes(cssWithKeys[prop].toString()) ? `filter`
                        : _subTrans;
            }
            else if (cssTransformKeys.includes(prop)) {
                _subTrans = `transform`;
            }
            const _newTransition = `${_subTrans} ${duration || `0.2`}s ${_curve} ${delay || 0}s`;
            if (!_transitionList.includes(_newTransition))
                _transitionList.push(_newTransition);
        });
        _transition.transition = _transitionList.join(`, `);
    }
    // console.log(_style, _transition)
    const drag = useDrag(dragOptions);
    let dragProps = {};
    let dragStyle = {};
    if (draggable) {
        dragProps = {
            onMouseDown: drag.onMouseDown,
        };
        dragStyle = {
            transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
        };
    }
    // console.log(`x`, buildWithStyles(_style),)
    return {
        style: {
            ...buildWithStyles(_style),
            ..._transition,
            ...(skeleton?.enabled ? buildSkeletonStyle(skeleton) : {}),
            ...dragStyle,
        },
        className: [
            className,
            ...cx,
            skeleton?.enabled ? `--skeleton` : ``,
            shimmer ? `--shimmer --${shimmer.toLowerCase()}` : ``,
            draggable ? `--draggable` : ``,
        ].join(' ').trim(),
        rest: {
            ...dragProps,
            ...cleanProps(rest, propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`]),
        },
    };
};
export default useBase;
