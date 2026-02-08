import { RefObject, useEffect, useMemo, useRef } from "react";
import { animationProps, dynamic } from "../types";
import { animationTransition, buildWithStyles, getAnimationCurve } from "../funs/css";

const useFx = (fx?: animationProps, ref?: RefObject<HTMLElement>) => {
    // Track keys we've applied so we can clean them up
    const appliedKeys = useRef<string[]>([]);

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

        const { transition, from, to, exit, when, duration = 0.3, delay = 0, curve } = fx;

        let activeStyles: dynamic = {};
        const { from: _f, to: _t } = transition 
            ? animationTransition(transition) 
            : { from: from || {}, to: to || {} };

        activeStyles = when === undefined ? { ..._f, ..._t } : when ? { ..._t } : (exit || _f);

        
        const _curve = getAnimationCurve(curve);
        const transitionList: string[] = [];
        const built = buildWithStyles(activeStyles);
        
        // console.log(`activeStyles`, activeStyles, built)

        // Track what we are touching for the cleanup logic
        appliedKeys.current = Object.keys(built);

        // Modern Browser Tip: Use individual transform properties if they exist
        // to prevent 'transform: translate(-50%, -50%)' from being overwritten
        const finalStyles: any = { ...built };

        // If we are using variables but 'translate' isn't explicitly set,
        // we must add it so the variables actually move the element.
        // if (finalStyles['--fx-x'] !== undefined || finalStyles['--fx-y'] !== undefined) {
        //     if (!finalStyles.translate) {
        //         // Fallback: This ensures standard boxes move while 
        //         // .abc boxes still use their complex calc() from the stylesheet
        //         finalStyles.translate = `var(--fx-x, 0px) var(--fx-y, 0px)`;
        //     }
        // }

        Object.keys(built).forEach((key) => {
            const transKey = key.startsWith('--') ? 'all' : key;
            if (!transitionList.includes(transKey)) {
                transitionList.push(`${transKey} ${duration}s ${_curve} ${delay}s`);
            }
            // transitionList.push(`${transKey} ${duration}s ${_curve} ${delay}s`);
        });

        return {
            style: {
                ...finalStyles,
                transition: transitionList.join(`, `),
            }
        };
    }, [fx]);
};

export default useFx