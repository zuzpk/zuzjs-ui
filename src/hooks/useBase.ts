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
        const _willChangeList : string[] = []
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
            // will-change: ${_subTrans}; 
            const _newTransition = `${_subTrans} ${duration || `0.2`}s ${_curve} ${delay || 0}s`
            if ( !_willChangeList.includes(_subTrans) ) _willChangeList.push(_subTrans)
            if ( !_transitionList.includes(_newTransition) ) _transitionList.push(_newTransition)
        })
        _transition.transition = _transitionList.join(`, `)
        _transition.willChange = _willChangeList.join(`, `)
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

    const handleScrollParallax = () => {
        
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
                animateCSSVar(ref, "--scroll-y", translateY)
                animateCSSVar(ref, "--scroll-x", translateX)
            }

        }
    
    }

    const handleMouseParallax = (e: MouseEvent) => {
        if (!fx || !fx.mouse || typeof window === 'undefined') return

        const now = performance.now()
        const dt = (now - lastTime.current) / 1000
        lastTime.current = now

        const { lerpFactor, x, y, multiplier, xMultiplier, yMultiplier } = fx.mouse

        // Normalize mouse position to center (0) range (-1 to 1)
        const vw = window.innerWidth
        const vh = window.innerHeight
        const nx = (e.clientX - vw / 2) / (vw / 2) // -1 to 1
        const ny = (e.clientY - vh / 2) / (vh / 2) // -1 to 1

        const dx = nx - currentScroll.current.x
        const dy = ny - currentScroll.current.y

        currentScroll.current.x += dx * (lerpFactor || 0.1)
        currentScroll.current.y += dy * (lerpFactor || 0.1)

        if (ref?.current) {
            const translateX = x ? currentScroll.current.x * (multiplier || xMultiplier || 20) : 0
            const translateY = y ? currentScroll.current.y * (multiplier || yMultiplier || 20) : 0

            animateCSSVar(ref, '--mouse-x', translateX)
            animateCSSVar(ref, '--mouse-y', translateY)
        }
    }

    useEffect(() => {
        if ( typeof window !== 'undefined' ){
            if ( fx && fx.scroll ){
                if (ref) {
                    ref.current.style.willChange = `transform`
                    ref.current.style.transform = `translate3d(0px, var(--scroll-y), 0)`
                    ref.current.style.transition = `transform 0.1s ${fx.curve ? getAnimationCurve(fx.curve) : `var(--spring)`}`
                }
                window.addEventListener('scroll', handleScrollParallax, { passive: true })
                    return () => {
                    window.removeEventListener('scroll', handleScrollParallax)
                }
            }
            if ( fx && fx.mouse ){
                if (ref) {
                    ref.current.style.willChange = `transform`
                    ref.current.style.transform = `translate3d(0px, var(--mouse-y), 0)`
                    ref.current.style.transition = `transform 0.1s ${fx.curve ? getAnimationCurve(fx.curve) : `var(--spring)`}`
                }
                window.document.addEventListener('mousemove', handleMouseParallax, { passive: true })
                    return () => {
                    window.removeEventListener('mousemove', handleMouseParallax)
                }
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