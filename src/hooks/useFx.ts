import { RefObject, useEffect, useMemo, useRef } from "react";
import { animationTransition, buildWithStyles, getAnimationCurve } from "../funs/css";
import { animationProps, dynamic } from "../types";

const useFx = (
    fx?: animationProps & {
        /** Offset when transition is activce */
        offset?: number;
        /** Offset when transition is inactive */
        margin?: number;
        watch?: string[]
    }, 
    ref?: RefObject<HTMLElement>
) => {
    // Track keys we've applied so we can clean them up
    const appliedKeys = useRef<string[]>([]);
    const hasMounted = useRef(false);

    useEffect(() => {
        if (!fx?.when) hasMounted.current = false;
    }, [fx?.transition]);

    useEffect(() => {
        const el = ref?.current;
        if (!el || !fx || !fx.clearAtEnd) return;

        const handleFinish = (e: TransitionEvent) => {
            // Only clear if the property that finished is one we controlled
            if (appliedKeys.current.includes(e.propertyName)) {
                // Option to clear everything or specific keys
                if (fx.clearAtEnd === true) {
                    el.style.transform = '';
                    el.style.filter = '';
                    // Reset to 'from' state or just remove inline styles
                    appliedKeys.current.forEach(key => el.style.removeProperty(key));
                }
            }
        };

        el.addEventListener('transitionend', handleFinish);
        return () => el.removeEventListener('transitionend', handleFinish);
    }, [fx, ref]);

    // Parallax logic remains similar but uses Individual Properties
    useEffect(() => {
        if (typeof window === 'undefined' || !ref?.current) return;
        const el = ref.current;

        if (fx?.scroll || fx?.mouse) {
            // INSTEAD OF: el.style.transform = `translate3d(...)`
            // WE USE: CSS Variables or Individual Props
            el.style.willChange = `transform`;
            
            // This allows the element to have a separate 'transform' in SCSS
            // while this hook only touches the 'translate' property
            el.style.translate = `var(--fx-x, 0px) var(--fx-y, 0px)`;
            el.style.transition = `translate 0.1s ${fx.curve ? getAnimationCurve(fx.curve) : 'var(--spring)'}`;
        }
    }, [fx, ref]);

    return useMemo(() => {

        if (!fx) return { style: {} };

        const { transition, from, to, exit, when, duration = 0.3, delay = 0, curve, margin = 0, offset = 20, watch = [] } = fx;

        const isWaitingForFirstPosition = when === false && !hasMounted.current;
        // const isExiting = when === false && hasMounted.current;
        
        if (when === true) hasMounted.current = true;

        let activeStyles: dynamic = {};
        const { from: _f, to: _t } = transition 
            ? animationTransition(transition, offset, margin) 
            : { from: from || {}, to: to || {} };

        activeStyles = when === undefined ? { ..._f, ..._t } : when ? { ..._t } : (exit || _f);

        
        const _curve = getAnimationCurve(curve);
        const transitionList: string[] = [];
        const built = buildWithStyles(activeStyles);
        const controlsOpacity = (
            (`opacity` in (_f || {})) ||
            (`opacity` in (_t || {})) ||
            (`opacity` in (exit || {}))
        );
        
        // Track what we are touching for the cleanup logic
        appliedKeys.current = Object.keys(built);

        // Modern Browser Tip: Use individual transform properties if they exist
        // to prevent 'transform: translate(-50%, -50%)' from being overwritten
        const finalStyles: any = { ...built };

        Object.keys(built).forEach((key) => {
            let transKey = key;
            if (key === '--fx-x' || key === '--fx-y') transKey = 'translate';
            else if (key === '--fx-rotate') transKey = 'rotate';
            else if (key.startsWith('--')) transKey = key;
            if (!transitionList.includes(transKey)) {
                transitionList.push(`${transKey} ${duration}s ${_curve} ${delay}s`);
            }
            // transitionList.push(`${transKey} ${duration}s ${_curve} ${delay}s`);
        });

        watch.forEach((key) => {
            if (!transitionList.includes(key)) {
                // We use a slightly different duration if you want, 
                // or just stick to the animation speed
                transitionList.push(`${key} 0.1s ${_curve} 0s`);
            }
        });

        // const isActive = when === true || when === undefined;

        return {
            style: {
                ...finalStyles,
                transition: isWaitingForFirstPosition ? 'none' : transitionList.join(`, `),
                opacity: controlsOpacity ? (isWaitingForFirstPosition ? 0 : finalStyles.opacity) : finalStyles.opacity,
                pointerEvents: isWaitingForFirstPosition ? 'none' : finalStyles.pointerEvents,
            }
        };
    }, [fx, fx?.when, fx?.watch]);
};

export default useFx