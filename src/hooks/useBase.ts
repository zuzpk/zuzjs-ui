import { animateCSSVar } from "@zuzjs/core";
import { ComponentPropsWithRef, CSSProperties, JSX, RefObject, useEffect, useRef } from "react";
import { cleanProps, css } from "../funs";
import { buildWithStyles, getAnimationCurve, getAnimationTransition } from "../funs/css";
import { cssFilterKeys, cssProps, cssTransformKeys, cssWithKeys } from "../funs/stylesheet";
import {
    cssShortKey,
    dynamicObject, Props, ZuzProps
} from "../types";
import { Skeleton } from "../types/interfaces";

let useDrag: any = null;
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
        style.minWidth = style.minHeight = s.defaultSize || `100%`
    }
        
    return style
}

const useBase = <T extends keyof JSX.IntrinsicElements>(props: Props<T>, ref?: RefObject<HTMLElement>) : {
    style : CSSProperties;
    className : string;
    rest: ComponentPropsWithRef<T>
} => {

    const {
        as,
        fx,
        animate,
        timeline,
        transition: autoTransition,
        skeleton,
        className,
        shimmer,
        propsToRemove,
        draggable,
        dragOptions,
        ...rest
    } = props || {};

    const currentScroll = useRef({ x: 0, y: 0 })
    const lastTime = useRef(performance.now())

    let cx : string[] = []
    if ( as ){
        cx = css().Build(`string` == typeof as ? as : as.join(` `)).cx;
    }

    const { transition, from, to, exit, when, duration, delay, curve, scroll } = autoTransition ? {
        transition: autoTransition,
        duration: 0.3
    } : fx || animate || {}

    let _style : dynamicObject = {};
    
    if ( undefined === when ){
        _style = transition ? getAnimationTransition(transition, true) : { ...from, ...to }
    }else if ( true === when ){
        _style = transition ? getAnimationTransition(transition, false) : { ...(to || {}) }
    }
    else {
        _style = transition ? getAnimationTransition(transition, false, true) : from || {};
    }

    const _transition : dynamicObject = {}

    if ( transition || (from && to) ){
        // { transition: `all ${duration || `0.2`}s ${getAnimationCurve(curve)} ${delay || 0}s` }
        const _curve = getAnimationCurve(curve)
        const _transitionList : string[] = []
        Object.keys(_style).forEach(ck => {
            let prop = ck as cssShortKey
            let _subTrans = ck
            if ( prop in cssWithKeys ){
                _subTrans = cssTransformKeys.includes(cssWithKeys[prop].toString()) ? `transform` 
                    : cssFilterKeys.includes(cssWithKeys[prop].toString()) ? `filter` 
                        :  _subTrans in cssProps ? cssProps[_subTrans] : _subTrans //(cssWithKeys[prop] || _subTrans).toString() // _subTrans
            }
            else if ( cssTransformKeys.includes(prop) ){
                _subTrans = `transform`
            }
            const _newTransition = `${_subTrans} ${duration || `0.2`}s ${_curve} ${delay || 0}s`
            if ( !_transitionList.includes(_newTransition) ) _transitionList.push(_newTransition)
        })
        _transition.transition = _transitionList.join(`, `)
    }

    // // console.log(_style, _transition)
    const is = typeof window !== "undefined";
    let dragProps = {};
    let dragStyle = {};

    if ( draggable && is ) {
        if (!useDrag) {
            import("./useDrag")
                .then(module => {
                    useDrag = module.default;
                })
                .catch(err => {
                    console.error("Error loading useDrag:", err);
                });
        }
        if ( useDrag ) {
            const drag = useDrag(dragOptions);
            dragProps = {
                onMouseDown: drag.onMouseDown,
            }
            dragStyle = {
                transform: `translate(${drag.position.x}px, ${drag.position.y}px)`,
            }
        }
    }

    const handleScroll = () => {
        
        if ( fx && fx.scroll && typeof window !== 'undefined' ){

            const now = performance.now()
            const dt = (now - lastTime.current) / 1000
            lastTime.current = now

            const { lerpFactor, x, y, multiplier, xMultiplier, yMultiplier } = fx.scroll
            const delta = window.scrollY - currentScroll.current.y
            const velocity = delta / dt
            currentScroll.current.y += delta * (lerpFactor || .1)
            
            if(ref?.current){
                const translateX = x ? currentScroll.current.x * x * (multiplier || xMultiplier || .25) : 0
                const translateY = y ? currentScroll.current.y * y * (multiplier || yMultiplier || .25) : 0
                // ref.current.style.setProperty(`--scroll-y`, `${translateY}px`)
                // transform = `translate3d(${translateX}px, ${translateY}px, 0)`.trim()
                animateCSSVar(ref, "--scroll-y", translateY)
            }

        }
    
    }

    useEffect(() => {
        if ( fx && fx.scroll && typeof window !== 'undefined' ){
            if (ref) {
                ref.current.style.transform = `translate3d(0px, var(--scroll-y), 0)`
                ref.current.style.transition = `transform 0.1s ${fx.curve ? getAnimationCurve(fx.curve) : `var(--spring)`}`
            }
            window.addEventListener('scroll', handleScroll, { passive: true })
                return () => {
                window.removeEventListener('scroll', handleScroll)
            }
        }
    }, [ref])

    return {
        style: {
            ...buildWithStyles(_style),
            ..._transition,
            ...(skeleton?.enabled? buildSkeletonStyle(skeleton) : {}),
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
            ...cleanProps( rest as Omit<ZuzProps, keyof ZuzProps>, propsToRemove ? [...propsToRemove, `skeleton`] : [`skeleton`] ),
        } as ComponentPropsWithRef<T>,
    }

}

export default useBase;