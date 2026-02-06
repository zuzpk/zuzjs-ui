import { cssFilterKeys, cssTransformKeys, cssWithKeys } from "../builder/stylesheet";
import { cssShortKey, dynamic, TRANSITION_CURVES, TRANSITIONS, ValueOf, ZuzStyleString } from "../types";
import styleGenerator from "../builder/style-generator";
import { PACKAGE_NAME } from ".";

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
    // 1. Normalize input to a single string
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

    // 2. Process and map tokens
    return raw
        .split(/\s+/)
        .filter(Boolean) // Remove empty strings from accidental double spaces
        .map(token => {
            /**
             * Check the manifest for the token.
             * If found, return the hash (e.g., "z123").
             * If not, return as-is (supports custom classes like "--sidebar").
             */
            // if ( !zuzMap[token] ) console.log(`[${PACKAGE_NAME}]`, token, `not found`)
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

// export const buildWithStyles = (source: dynamic) : dynamic => {
    
//     const _ : dynamic = {}
    
//     if ( Object.keys(source).length > 0 ){

//         const _transform : string[] = [];
//         const _filter : string[] = [];

//         for ( const _prop in source ){
//             let prop = _prop as cssShortKey
//             if ( prop in cssWithKeys ){
//                 if ( cssTransformKeys.includes(cssWithKeys[prop].toString()) ){
//                     _transform.push(`${cssWithKeys[prop]}(${styleGenerator.addUnitsToComplexValue(prop, source[prop])})`)
//                 }
//                 if ( cssFilterKeys.includes(cssWithKeys[prop].toString()) ){
//                     _filter.push(`${cssWithKeys[prop]}(${styleGenerator.addUnitsToComplexValue(prop, source[prop])})`)
//                 }
//                 else 
//                     _[cssWithKeys[prop]] = source[prop]
//             }
//             else {
//                 if ( cssTransformKeys.includes(prop) ){
//                     _transform.push(`${prop}(${styleGenerator.addUnitsToComplexValue(prop, source[prop])})`)
//                 }
//                 else if ( cssFilterKeys.includes(prop) ){
//                     _filter.push(`${prop}(${styleGenerator.addUnitsToComplexValue(prop, source[prop])})`)
//                 }
//                 else 
//                     _[prop] = source[prop]
//             }   
//         }

//         if ( _transform.length > 0 ){
//             _.transform = _transform.join(` `)
//         }
//         if ( _filter.length > 0 ){
//             _.filter = _filter.join(` `)
//         }

//     }  

//     return _
    
// }

export const buildWithStyles = (source: dynamic): dynamic => {
    const _: dynamic = {};
    
    if (Object.keys(source).length > 0) {
        for (const _prop in source) {
            let prop = _prop as cssShortKey;
            let value = source[prop];

            // Check if it's a CSS Variable
            if (prop.startsWith('--')) {
                // Just pass it through directly to the style object
                _[prop] = value;
                continue; 
            }

            let targetProp = prop in cssWithKeys ? cssWithKeys[prop].toString() : prop;

            // MAP TO INDIVIDUAL PROPERTIES INSTEAD OF TRANSFORM STRING
            if (cssTransformKeys.includes(targetProp)) {
                // If it's x/y, map to 'translate' property components
                if (targetProp === 'translateX' || targetProp === 'x') {
                    _.translate = `${styleGenerator.addUnitsToComplexValue(prop, value)} ${_.translate?.split(' ')[1] || '0px'}`;
                } else if (targetProp === 'translateY' || targetProp === 'y') {
                    _.translate = `${_.translate?.split(' ')[0] || '0px'} ${styleGenerator.addUnitsToComplexValue(prop, value)}`;
                } else {
                    // For scale, rotate, etc.
                    _[targetProp.replace('translate', 'translate')] = styleGenerator.addUnitsToComplexValue(prop, value);
                }
            } else if (cssFilterKeys.includes(targetProp)) {
                // Keep filters as is or handle similarly
                _[targetProp] = styleGenerator.addUnitsToComplexValue(prop, value);
            } else {
                _[targetProp] = value;
            }
        }
    }
    return _;
};

export const getAnimationCurve = ( curve?: string | ValueOf<typeof TRANSITION_CURVES> ): string => {

    if ( !curve ) return `linear`

    switch(curve.toUpperCase()){
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
        default:
            return `linear`
    }

}

export const animationTransition = (transition: ValueOf<typeof TRANSITIONS>, offset = 0) => {
    let _from = {};
    let _to = {};

    // Offset defaults to 20px if not provided for standard slides
    const moveAmount = offset || 20;

    switch (transition) {
        case TRANSITIONS.SlideInLeft:
        case TRANSITIONS.SlideInRight:
            const isLeft = transition === TRANSITIONS.SlideInLeft;
            _from = { 
                '--fx-x': isLeft ? `-${moveAmount}px` : `${moveAmount}px`, 
                opacity: 0 
            };
            _to = { '--fx-x': '0px', opacity: 1 };
            break;

        case TRANSITIONS.SlideInTop:
        case TRANSITIONS.SlideInBottom:
            const isTop = transition === TRANSITIONS.SlideInTop;
            _from = { 
                '--fx-y': isTop ? `-${moveAmount}px` : `${moveAmount}px`, 
                opacity: 0 
            };
            _to = { '--fx-y': '0px', opacity: 1 };
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