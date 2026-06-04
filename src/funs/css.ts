import { PACKAGE_NAME, splitAtoms } from ".";
import styleGenerator from "../builder/style-generator";
import { cssTransformKeys, cssWithKeys } from "../builder/stylesheet";
import { cssShortKey, dynamic, TRANSITION_CURVES, TRANSITIONS, ValueOf, ZuzStyleString } from "../types";

const ZUZ_MAP_KEY = Symbol.for("zuz.global.map");

export const setZuzMap = (map: Record<string, string>) => {
    (globalThis as any)[ZUZ_MAP_KEY] = map;
};

export const getZuzMap = (): Record<string, string> => {
    return (globalThis as any)[ZUZ_MAP_KEY] || {};
};

/**
 * Converts Zuz utility strings or arrays into hashed class names.
 */
export const buildClassString = (input: ZuzStyleString | ZuzStyleString[]): string => {
    // Normalize input to a single string
    const raw = Array.isArray(input) ? input.join(" ") : input;
    
    // Safety check for empty or non-string inputs
    if (!raw || typeof raw !== 'string') return "";

    const zuzMap = getZuzMap();

    // Check if map is empty and it's a dev environment
    if (process.env.NODE_ENV === 'development' && Object.keys(zuzMap).length === 0) {
        console.warn(
            `[${PACKAGE_NAME}] No utility map detected. Classes will not be hashed. `,
            `Ensure you call setZuzMap() or use <ThemeProvider zuzMap={...} />.`
        );
    }

    const tokens = splitAtoms(raw).filter(Boolean);

    // 2. Process and map tokens
    // console.log(`--splitAtoms`,  splitAtoms(raw))
    return tokens.map(token => {

            const groupMatch = token.match(/^([&@][\w-]+)\((.*)\)$/);
            
            if (groupMatch) {
                const [_, prefix, innerContent] = groupMatch;
                return splitAtoms(innerContent)
                    .map(atom => {
                        const key = `${prefix}(${atom})`; // Reconstruct the key
                        return zuzMap[key] || atom;
                    })
                    .join(" ");
            }

            /**
             * Check the manifest for the token.
             * If found, return the hash (e.g., "z123").
             * If not, return as-is (supports custom classes like "--sidebar").
             */
            // if ( process.env.NODE_ENV === 'development' && !zuzMap[token] ) console.log(`[${PACKAGE_NAME}]`, token, `not found`)
            return zuzMap[token] || token;
        })
        .join(" ");
};

/**
 * Standalone CSS utility for non-zuzjs components.
 */
export const css = (input: ZuzStyleString | ZuzStyleString[]): string => {
    // 1. Normalize input: Join arrays or treat as single string
    const raw = Array.isArray(input) ? input.join(" ") : input;
    
    // Safety check for empty strings or undefined
    if (!raw || typeof raw !== 'string') return "";
    
    // 2. Process tokens: Split by whitespace
    // We use a regex split to handle multiple spaces or newlines gracefully
    return buildClassString(raw);

};

export const buildWithStyles = (source: dynamic): dynamic => {
    const _: dynamic = {};
    
    for (const key in source) {
        const value = source[key];
        if (key.startsWith('--')) {
            _[key] = value;
            continue; 
        }

        const targetProp = cssWithKeys[key as cssShortKey]?.toString() ?? key;

        // Individual Transform Properties (Modern 2026)
        if (targetProp === 'x' || targetProp === 'translateX') {
            const current = _.translate?.split(' ') ?? ['0px', '0px'];
            _.translate = `${styleGenerator.addUnitsSafely(key, value)} ${current[1] ?? '0px'}`;
        } 
        else if (targetProp === 'y' || targetProp === 'translateY') {
            const current = _.translate?.split(' ') ?? ['0px', '0px'];
            _.translate = `${current[0] ?? '0px'} ${styleGenerator.addUnitsSafely(key, value)}`;
        }
        else if (cssTransformKeys.includes(targetProp as any)) {
            // scale, rotate, etc.
            _[targetProp] = styleGenerator.addUnitsSafely(key, value);
        }
        else {
            _[targetProp] = value;
        }
    }
    return _;
};

export const getAnimationCurve = ( curve?: string | ValueOf<typeof TRANSITION_CURVES> ): string => {

    if ( !curve ) return `linear`

    switch(curve.toUpperCase()){
        case TRANSITION_CURVES.Linear:
            return `linear`
        case TRANSITION_CURVES.Ease:
            return `ease`
        case TRANSITION_CURVES.EaseIn:
            return `ease-in`
        case TRANSITION_CURVES.EaseOut:
            return `ease-out`
        case TRANSITION_CURVES.Bounce:
            return `var(--bounce)`
        case TRANSITION_CURVES.Liquid:
            return `var(--liquid)`
        case TRANSITION_CURVES.Spring:
            // return `cubic-bezier(0.2, -0.36, 0, 1.46)`
            return `var(--spring)`
        case TRANSITION_CURVES.EaseInOut:
            // return `cubic-bezier(0.42, 0, 0.58, 1)`
            return `ease-in-out`
        case TRANSITION_CURVES.EaseOutBack:
            return `cubic-bezier(0.34, 1.56, 0.64, 1)`
        default:
            return `linear`
    }

}

export const animationTransition = (transition: ValueOf<typeof TRANSITIONS>, startOffset = 0, endOffset = 0) => {
    let _from = {};
    let _to = {};

    // Offset defaults to 20px if not provided for standard slides
    const moveAmount = startOffset || 20;
    const idleAmount = endOffset || 0;

    switch (transition) {
        case TRANSITIONS.SlideInLeft:
        case TRANSITIONS.SlideInRight:
            const isLeft = transition === TRANSITIONS.SlideInLeft;
            _from = { 
                '--fx-x': isLeft ? `-${moveAmount}px` : `${moveAmount}px`, 
                opacity: 0 
            };
            _to = { '--fx-x': `${idleAmount}px`, opacity: 1 };
            break;

        case TRANSITIONS.SlideInTop:
        case TRANSITIONS.SlideInBottom:
            const isTop = transition === TRANSITIONS.SlideInTop;
            _from = { 
                '--fx-y': isTop ? `-${moveAmount}px` : `${moveAmount}px`, 
                opacity: 0 
            };
            _to = { '--fx-y': `${idleAmount}px`, opacity: 1 };
            break;
        case TRANSITIONS.SlideInTopScale:
        case TRANSITIONS.SlideInBottomScale:
            const _isTop = transition === TRANSITIONS.SlideInTopScale;
            _from = { 
                '--fx-y': _isTop ? `-${moveAmount}px` : `${moveAmount}px`, 
                scale: 0.8,
                opacity: 0.78
            };
            _to = { 
                '--fx-y': `${idleAmount}px`, 
                scale: 1,
                opacity: 1 
            };
            break;

        case TRANSITIONS.ScaleIn:
            // Scale and Rotate are usually "center-relative" anyway, 
            // but we can use variables if you want to compose them.
            _from = { scale: 0, opacity: 0 };
            _to = { scale: 1, opacity: 1 };
            break;

        case TRANSITIONS.FadeIn:
            _from = { opacity: 0 };
            _to = { opacity: 1 };
            break;

        case TRANSITIONS.Zoom:
            _from = { scale: 0.92, opacity: 0 };
            _to = { scale: 1, opacity: 1 };
            break;

        case TRANSITIONS.Bounce:
            _from = { y: `${moveAmount}px`, opacity: 0 };
            _to = { y: `${idleAmount}px`, opacity: 1 };
            break;

        case TRANSITIONS.Flip:
            _from = { rotateY: `-90deg`, opacity: 0 };
            _to = { rotateY: `0deg`, opacity: 1 };
            break;

        case TRANSITIONS.Rotate:
            _from = { rotate: `-8deg`, opacity: 0 };
            _to = { rotate: `0deg`, opacity: 1 };
            break;

        case TRANSITIONS.Pulse:
            _from = { scale: 0.98, opacity: 0.9 };
            _to = { scale: 1, opacity: 1 };
            break;

        case TRANSITIONS.Shake:
            _from = { x: `-${Math.max(4, Math.floor(moveAmount / 4))}px`, opacity: 1 };
            _to = { x: `${idleAmount}px`, opacity: 1 };
            break;
    }

    return { from: _from, to: _to };
};

export const getAnimationTransition = (
    transition: ValueOf<typeof TRANSITIONS>, 
    to?: boolean, 
    from?: boolean
): dynamic => {
    const { from: _from, to: _to } = animationTransition(transition);

    // If 'to' is requested, we merge them (usually for static 'active' states)
    // If 'from' is requested, return starting state, else return ending state.
    if (to) return { ..._from, ..._to };
    return from ? _from : _to;
};