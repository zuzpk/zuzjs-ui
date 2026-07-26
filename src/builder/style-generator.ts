import { dynamic, isColor } from "@zuzjs/core";
import Hashids from "hashids";
import {
    cssAnimationCurves,
    cssDirect,
    cssProps,
    cssPropsWithColor
} from "./stylesheet";


interface UtilityToken {
    prop: string;
    value: string;
    isCustom?: boolean;
    isImportant?: boolean; // !important flag
    pseudo?: string; // e.g., 'hover', 'active'
    media?: string;  // e.g., 'md', 'lg'
    selector?: string; // for nested children
}

class StyleGenerator {

    private propMap = cssProps;
    private directMap = cssDirect;
    private colorProps = new Set(cssPropsWithColor);
    private animationCurves = cssAnimationCurves;

    private delimeter = ","; // Value will be passed by this seperator like border:1,ddd,solid
    private hashids: Hashids;
    private mediaQueries: Record<string, string> = {
        ph: `(max-width: 599px)`,
        sm: `(min-width: 600px) and (max-width: 767px)`,
        md: `(min-width: 768px)`, // Medium Devices
        lg: `(min-width: 992px)`,
        xl: `(min-width: 1200px)`,
    };
    private __SALT : string = `zuzjs-ui`
    // Key: FilePath, Value: Set of hashes used in that file
    private fileMap: Map<string, Set<string>> = new Map();
    private cache: Map<string, string> = new Map(); // Global atomic cache
    // Stores the hashes we've already created (Key: RuleKey, Value: Hash)
    // RuleKey is "prop-value-pseudo-media"
    private ruleTracker: Map<string, string> = new Map();
    private rawRuleMap: Map<string, Set<string>> = new Map();
    private dollorToVarRegexp = /\$([a-zA-Z0-9_-]+)/g

    constructor() {
        this.hashids = new Hashids(this.__SALT, 5);
    }

    /**
     * Entry point: Converts "w:100 &hover(bg:red)" into class names
     */
    public parseAndGenerate(rawString: string, filePath: string) : string[] {
        
        
        // // 1. SILENT EXIT: If we've already parsed this exact string (e.g., "w:100"), stop.
        // if (this.processedStrings.has(rawString)) return [];
        // console.log(`--rawString`, rawString)
        const tokens = this.tokenize(rawString);
        // console.log(`--tokens`, tokens)
        const classes: string[] = [];
        
        if (!this.fileMap.has(filePath)) {
            this.fileMap.set(filePath, new Set());
        }

        for (const token of tokens) {
            const className = this.generateAtomicClass(token);
            classes.push(className);
            this.fileMap.get(filePath)!.add(className);
        }

        // 3. Mark as processed
        // this.processedStrings.add(rawString);

        return classes;
    }

    private tokenize(input: string): UtilityToken[] {
        // if ( input.includes(`x:-`) ) 
        // console.log(`0--`, input)
        const tokens: UtilityToken[] = [];
        let i = 0;
        // console.log(`tokenizing`, input)
        const walk = (ctx: { pseudo?: string; media?: string; selector?: string }) => {
            let buffer = "";
            let bracketDepth = 0; // Track if we are inside [ ]

            while (i < input.length) {
                const char = input[i];

                // Track bracket depth
                if (char === '[') bracketDepth++;
                if (char === ']') bracketDepth--;

                if (char === '(' && bracketDepth === 0) {
                    const raw = buffer.trim();
                    const nextCtx = { ...ctx };

                    if (raw.startsWith('&')) {
                        // // nextCtx.pseudo = raw.replace('&', '');
                        // const pseudoName = raw.replace('&', '');
        
                        // if (pseudoName === 'even') nextCtx.pseudo = 'nth-child(even)';
                        // else if (pseudoName === 'odd') nextCtx.pseudo = 'nth-child(odd)';
                        // else if (pseudoName.startsWith('nth')) {
                        //     // This will capture the 'nth' part; the recursive 'walk' 
                        //     // will pick up the argument inside the parentheses.
                        //     nextCtx.pseudo = 'nth-child'; 
                        // } else {
                        //     nextCtx.pseudo = pseudoName;
                        // }
                        const p = raw.slice(1);
                        // Handle Shortcuts
                        if (p === 'even') nextCtx.pseudo = 'nth-child(even)';
                        else if (p === 'odd') nextCtx.pseudo = 'nth-child(odd)';
                        else if (p === 'first') nextCtx.pseudo = 'first-child';
                        else if (p === 'last') nextCtx.pseudo = 'last-child';
                        // Handle nth-child(x)
                        else if (p.startsWith('nth')) {
                            // Look ahead for the argument in this specific bracket
                            let arg = "";
                            let j = i + 1;
                            let depth = 1;
                            while (j < input.length && depth > 0) {
                                if (input[j] === '(') depth++;
                                if (input[j] === ')') depth--;
                                if (depth > 0) arg += input[j];
                                j++;
                            }
                            nextCtx.pseudo = `nth-child(${arg.trim()})`;
                            i = j - 1; // Move pointer to the end of the arg bracket
                        } 
                        else nextCtx.pseudo = p;

                    } else if (raw.startsWith('@')) {
                        nextCtx.media = raw.replace('@', '');
                    } else {
                        nextCtx.selector = ctx.selector ? `${ctx.selector} ${raw}` : raw;
                    }

                    buffer = "";
                    i++;
                    walk(nextCtx);
                } 
                else if (char === ')' && bracketDepth === 0) {
                    if (buffer.trim()) this.pushToken(tokens, buffer.trim(), ctx);
                    buffer = "";
                    return; 
                    // const val = buffer.trim();
                    // // If we were waiting for an nth-child argument
                    // if (ctx.pseudo === 'nth-child') {
                    //     ctx.pseudo = `nth-child(${val})`;
                    // } else if (val) {
                    //     this.pushToken(tokens, val, ctx);
                    // }
                    // buffer = "";
                    // return;
                } 
                // ONLY split on space if we are NOT inside brackets
                else if ((char === ' ' || char === '\n') && bracketDepth === 0) {
                    if (buffer.trim()) this.pushToken(tokens, buffer.trim(), ctx);
                    buffer = "";
                } 
                else {
                    buffer += char;
                }
                i++;
            }
            if (buffer.trim()) this.pushToken(tokens, buffer.trim(), ctx);
        };

        walk({});
        return tokens;
    }

    private pushToken(tokens: UtilityToken[], raw: string, ctx: any) {

        let trimmedRaw = raw.trim();
        const isImportant = trimmedRaw.endsWith('!');
        trimmedRaw = isImportant ? trimmedRaw.slice(0, -1) : trimmedRaw;

        // Special Case: if we are inside an nth-child context, the 'raw' is the argument (e.g., "3" or "2n+1")
        if (ctx.pseudo === 'nth-child' && !trimmedRaw.includes(':')) {
            ctx.pseudo = `nth-child(${trimmedRaw})`;
            return; // Don't push a token yet, wait for the actual property inside
        }

        // 1. if it's a standard property (w:100)
        if (trimmedRaw.includes(':')){
            // const [prop, value] = trimmedRaw.split(':');
            const colonIndex = trimmedRaw.indexOf(':');
            const prop = trimmedRaw.slice(0, colonIndex).trim();
            const value = trimmedRaw.slice(colonIndex + 1).trim();

            // console.log(`[Lexer] Pushing: ${prop} with value: ${value}`);

            tokens.push({
                prop: prop.trim(),
                value: value.trim(),
                isImportant: isImportant,
                ...ctx
            });
        }
        // 2. if it's a known Direct Shortcut (flex, grid, jcc)
        else if (this.directMap[trimmedRaw]) {
            tokens.push({
                prop: trimmedRaw, // Don't append ! to prop, use isImportant flag instead
                value: undefined, // Directs often don't have a value
                isCustom: false, // This is a Zuz utility!
                isImportant: isImportant,
                ...ctx
            });
        }
        // 3. Otherwise, it's a custom class (--sidebar, my-class)
        else{
            tokens.push({
                prop: raw.trim(),
                isCustom: true,
                ...ctx
            })
        }
    }

    private generateAtomicClass(token: UtilityToken): string {

        const { prop, value, pseudo, media, selector, isCustom, isImportant } = token;

        if ( isCustom ){
            return prop
        }
        
        let cssRuleBody = "";

        // 1. If it has a value AND is in propMap, it's a Property (e.g., flex:1)
        // 2. If it has NO value AND is in directMap, it's a Shortcut (e.g., flex)

        if (!value && this.directMap[prop]) {
            cssRuleBody = this.directMap[prop];
            // Add !important if flag is set
            if (isImportant) {
                cssRuleBody = (cssRuleBody.endsWith(';') ? cssRuleBody.slice(0, -1) : cssRuleBody) + ' !important;';
            } 
            // if ( isImportant ){
            //     cssRuleBody = ( cssRuleBody.endsWith(`;`) ? cssRuleBody.slice(0, -1) : cssRuleBody ) + ' !important;';
            // }
            // console.log(`--ppd`, prop, value)
        } 
        else {
            // It's a standard property (w:100, flex:1)
            const cssProp = this.propMap[prop] || prop;
            let processedValue = cssProp.includes("__") 
                ? this.resolveComplexTemplate(prop, value || "", cssProp) 
                : this.processValue(prop, value || "");
            
            // Add !important if flag is set
            if (isImportant && !processedValue.includes('!important')) {
                processedValue = processedValue.endsWith(';') 
                    ? processedValue.slice(0, -1) + ' !important;'
                    : processedValue + ' !important';
            }
            
            cssRuleBody = cssProp.includes("__") 
                ? processedValue
                : `${cssProp}: ${processedValue};`;
        }
        // if (!value && this.directMap[prop]) {
        //     const template = this.directMap[prop];
        //     cssRuleBody = template.includes("__") 
        //         ? this.resolveComplexTemplate(prop, value || "", template) 
        //         : template;
            
        // } 
        // else {
        //     console.log(`--ppp`, prop, value)
        //     // It's a standard property (w:100, flex:1)
        //     const cssProp = this.propMap[prop] || prop;
        //     const processedVal = this.processValue(prop, value || "");
        //     cssRuleBody = `${cssProp}: ${processedVal};`;
        // }

        // 2. Create a "Universal Key" based on the actual CSS and modifiers
        // This is the "secret sauce" to deduplication
        const universalKey = `${cssRuleBody}|${pseudo || ''}|${media || ''}|${selector || ''}`;

        // 3. Check if we've already generated a hash for this EXACT CSS behavior
        if (this.ruleTracker.has(universalKey)) {
            return this.ruleTracker.get(universalKey)!;
        }

        // 4. Generate Hash based on the CSS behavior
        // const hash = `z${universalKey.charAt(0)}${this.hashids.encode(this.stringToPositionalSum(universalKey))}`;
        const hash = `z${universalKey.charAt(0)}${this.generateHash(universalKey)}`;
        let base = `.${hash}${pseudo ? `:${pseudo}` : ''}${selector ? ` ${selector}` : ''}`;
        let finalRule = `${base} { ${cssRuleBody} }`;

        // Handle Media/Dark stacking
        if (media) {
            media.split(' ').forEach(q => {
                if (q === 'dark') finalRule = `[color-scheme="dark"] ${finalRule}`;
                else if (this.mediaQueries[q]) {
                    finalRule = `@media ${this.mediaQueries[q]} { ${finalRule} }`;
                }
            });
        }

        this.cache.set(hash, finalRule);
        this.ruleTracker.set(universalKey, hash); // Store by the CSS behavior key
        return hash;
        
    }

    private resolveComplexTemplate(prop: string, rawValue: string, template: string): string {
        
        const parts = rawValue.split(this.delimeter);
        let result = template;

        if (prop === "anim") {
            const [duration, curve, delay] = parts;
            result = result
                .replace("__VALUE__", this.processValue("transitionDuration", duration || "0s"))
                .replace("__CURVE__", curve?.startsWith(`$`) ? curve.replace(this.dollorToVarRegexp, 'var(--$1)') : this.animationCurves[curve] || "ease-in-out")
                .replace("__DELAY__", this.processValue("transitionDelay", delay || "0s"));
        } 

        if (prop === "keyframes" || prop === "play") {
            const [name, duration, curve, iteration] = parts;
            result = result
                .replace("__NAME__", this.processValue("animationName", name || ""))
                .replace("__DURATION__", this.processValue("animationDuration", duration || "0s"))
                .replace("__CURVE__", curve?.startsWith(`$`) ? curve.replace(this.dollorToVarRegexp, 'var(--$1)') : this.animationCurves[curve] || "linear")
                .replace("__ITERATIONS__", this.processValue("animationIterationCount", iteration || "0s"));
        } 
        
        else if (prop === "rotate3d") {
            const [x, y, z, a] = parts;
            result = result
                .replace("__X__", x || "0")
                .replace("__Y__", y || "0")
                .replace("__Z__", z || "0")
                .replace("__A__", a ? (isNaN(Number(a)) ? a : `${a}deg`) : "0deg");
        }

        // Fallback for generic __VALUE__ if not handled above
        return result.replace(/__VALUE__/g, this.processValue(prop, parts[0] || ""));
    }

    private buildClampValue(prop: string, rawValue: string): { min: string; fluid: string; max: string } {
        const parts = rawValue
            .split(this.delimeter)
            .map(part => part.trim())
            .filter(Boolean);

        // Auto clamp calculator: clamp:min,max[,minViewport,maxViewport]
        if (parts.length === 4 || parts.length === 2) {
            const min = this.normalizeClampBound(prop, parts[0] || "0");
            const max = this.normalizeClampBound(prop, parts[1] || parts[0] || "0");

            const minPx = this.toPxNumber(min);
            const maxPx = this.toPxNumber(max);

            if (minPx === null || maxPx === null) {
                return {
                    min,
                    fluid: '1vw',
                    max,
                };
            }

            const minViewport = parts.length === 4
                ? Number(parts[2])
                : 390;
            const maxViewport = parts.length === 4
                ? Number(parts[3])
                : 1440;

            const safeMinViewport = Number.isFinite(minViewport) && minViewport > 0 ? minViewport : 390;
            const safeMaxViewport = Number.isFinite(maxViewport) && maxViewport > safeMinViewport
                ? maxViewport
                : 1440;

            const fluid = this.calculateClampFluid(minPx, maxPx, safeMinViewport, safeMaxViewport);

            return { min, fluid, max };
        }

        // Explicit clamp tuple: clamp:min,fluid,max
        if (parts.length >= 3) {
            const min = this.normalizeClampBound(prop, parts[0]);
            const fluid = this.normalizeClampFluid(parts[1]);
            const max = this.normalizeClampBound(prop, parts[2]);

            return { min, fluid, max };
        }

        const bound = this.normalizeClampBound(prop, parts[0] || rawValue || "0");
        return {
            min: bound,
            fluid: this.normalizeClampFluid(parts[1] || '1vw'),
            max: bound,
        };
    }

    private normalizeClampBound(prop: string, value: string): string {
        const trimmed = (value || "").trim();
        if (!trimmed) return "0px";

        if (this.isNumberToken(trimmed)) {
            return this.addUnitsSafely(prop, trimmed);
        }

        return trimmed.replace(this.dollorToVarRegexp, 'var(--$1)');
    }

    private normalizeClampFluid(value: string): string {
        const trimmed = (value || "").trim();
        if (!trimmed) return "1vw";

        if (this.isNumberToken(trimmed)) {
            return `${trimmed}vw`;
        }

        return trimmed.replace(this.dollorToVarRegexp, 'var(--$1)');
    }

    private toPxNumber(value: string): number | null {
        const normalized = value.trim();
        const match = normalized.match(/^(-?\d*\.?\d+)(px)?$/i);
        if (!match) return null;

        const parsed = Number(match[1]);
        return Number.isFinite(parsed) ? parsed : null;
    }

    private calculateClampFluid(minPx: number, maxPx: number, minViewport: number, maxViewport: number): string {
        const viewportRange = maxViewport - minViewport;

        if (viewportRange <= 0) {
            return `${this.roundClampNumber(minPx)}px`;
        }

        const slope = ((maxPx - minPx) / viewportRange) * 100;
        const intercept = minPx - (slope * minViewport) / 100;

        const slopeText = this.roundClampNumber(slope);

        if (Math.abs(intercept) < 0.0001) {
            return `${slopeText}vw`;
        }

        const sign = intercept >= 0 ? '+' : '-';
        const absIntercept = this.roundClampNumber(Math.abs(intercept));
        return `calc(${absIntercept}px ${sign} ${slopeText}vw)`;
    }

    private roundClampNumber(value: number): string {
        const rounded = Math.round(value * 10000) / 10000;
        return Number(rounded.toFixed(4)).toString();
    }

    private isNumberToken(value: string): boolean {
        return /^-?\d*\.?\d+$/.test(value.trim());
    }

    private transformBrackets(input: string): string {
        return input
            .replace(/\[/g, '(')
            .replace(/\]/g, ')')
            .replace(this.dollorToVarRegexp, 'var(--$1)');
    }

    public addUnitsSafely(prop: string, val: string): string {

        // Props whose numeric values must stay unitless (or %, which the author supplies).
        // CSS filter multipliers (brightness/contrast/…) accept number | % — never px.
        const unitlessProps = [
            "opacity", "zIndex", "z-index", "flex", "b", "font-weight", "fontWeight",
            "lineHeight", "line-height", "lh",
            "scale", "scaleX", "scaleY", "scaleZ",
            "ratio", "aspectRatio", "aspect-ratio",
            "shrink", "flex-shrink", "flexShrink", "grow", "flex-grow", "flexGrow", "order",
            // filter / backdrop multipliers
            "brightness", "contrast", "saturate", "grayscale", "invert", "sepia",
        ];

        // Angle props — bare numbers become deg
        const angleProps = [
            "rotate", "rotateX", "rotateY", "rotateZ",
            "skew", "skewX", "skewY",
            "hue-rotate", "hueRotate",
        ];

        if (unitlessProps.includes(prop)) return val;

        // 1. Pure number → unit by prop kind
        if (/^-?\d*\.?\d+$/.test(val)) {
            if (angleProps.includes(prop)) return `${val}deg`;
            return `${val}px`;
        }

        /**
         * 2. Advanced Regex for complex strings (calc, filter(...), repeat, etc.)
         * Match bare numbers but EXCLUDE:
         * - Numbers already followed by a unit (100vh) — handled by the lookahead
         * - First arg of repeat(n, …)
         * - Args of unitless CSS functions (brightness, scale, …)
         * - Args of angle functions (use deg instead)
         * - Color channel args in rgb/hsl
         */
        const unitlessFnBefore = /(?:brightness|contrast|saturate|grayscale|invert|sepia|opacity|scale(?:X|Y|Z)?)\s*\(\s*$/i;
        const angleFnBefore = /(?:hue-rotate|rotate(?:X|Y|Z|3d)?|skew(?:X|Y)?)\s*\(\s*$/i;
        const colorFnBefore = /(?:rgba?|hsla?)\s*\([^)]*$/i;

        return val.replace(/(?<=^|[\s\+\-\*\/\(\,])(-?\d*\.?\d+)(?=$|[\s\+\-\*\/\)\,])/g, (match, _number, offset, fullString) => {
            const beforeMatch = fullString.substring(0, offset);
            const beforeTrim = beforeMatch.trim();

            // repeat(5, 1fr) — first arg is unitless count
            if (beforeTrim.endsWith('repeat(')) {
                return match;
            }

            // brightness(1.2), saturate(0.5), scale(1.05), …
            if (unitlessFnBefore.test(beforeMatch)) {
                return match;
            }

            // hue-rotate(90), rotate(45), …
            if (angleFnBefore.test(beforeMatch)) {
                return `${match}deg`;
            }

            // rgb(255, 0, 0) / hsl(…) — never append length units
            if (colorFnBefore.test(beforeMatch)) {
                return match;
            }

            return `${match}px`;
        });
    }

    private processValue(prop: string, val: string): string {
        // Note: !important flag is now handled in generateAtomicClass,
        // so we don't need to check for it here anymore
        let result = "";

        /** w:full */
        if (val.trim() == `full`){
            result = `100%`
        }
        /** w:full */
        else if (val.trim() == `half`){
            result = `50%`
        }

        else if (
            this.propMap[prop] && 
            [`xs`, `sm`, `md`, `lg`, `xl`, `xxl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`, `8xl`, `9xl`].includes(val.trim())
        ){
            const pval = this.propMap[prop]
            const sizeMap : dynamic = {
                'border-radius' : 'radius',
                'line-height' : 'lh',
                'font-size': 'text'
            }
            result = `var(--${
                pval in sizeMap ? sizeMap[pval]
                    : pval}-${val.trim()})`

            // console.log(result)

        }

        // If it's a bracketed value (calc, etc.)
        else if (val.includes('[') || val.includes(']')) {
            // Swap symbols and handle variables
            let transformed = this.transformBrackets(val);
            
            const [ _kw ] = val.split(`[`)
            if ( [`rgba`,`rgb`].includes(_kw) ){
                result = transformed
            }
            else if (_kw === 'clamp') {
                const start = val.indexOf('[');
                const end = val.lastIndexOf(']');
                const inner = start > -1 && end > start
                    ? val.slice(start + 1, end)
                    : '';

                const clamp = this.buildClampValue(prop, inner);
                result = `clamp(${clamp.min}, ${clamp.fluid}, ${clamp.max})`;
            }
            else
                // Use a "Smart Unit Fixer" that only touches numbers 
                // that are not already attached to a unit.
                result = this.addUnitsSafely(prop, transformed);
        } 
        // Comma Logic
        else if (val.includes(',')) {
            result = val.split(',').map(part => this.processValue(prop, part.trim())).join(' ');
        }
        // Standard Logic (Pure Numbers, Variables, Colors)
        else if (this.isNumberToken(val)) {
            result = this.addUnitsSafely(prop, val);
        }
        // COLOR CHECK (Only if it's 3/6 chars and NOT a pure number)
        else if (isColor(val)) {
            result = this.makeColor(val)
        }
        else if (
            val.startsWith(`gradient`) || 
            val.startsWith(`linear-gradient`) || 
            val.startsWith(`radial-gradient`)
        ){
            result = this.parseGradient(val);
        }
        else {
            result = val.replace(this.dollorToVarRegexp, 'var(--$1)');
        }

        return result;
    }

    public addUnitsToComplexValue(prop: string, val: string): string {
        // Delegate to addUnitsSafely so unitless props (brightness, opacity, …)
        // and function contexts stay consistent.
        try {
            return this.addUnitsSafely(prop, String(val));
        } catch (e) {
            return val;
        }
    }

    private makeColor(v: string){

        if ( v.charAt(0) == `#` ){
            v = v.substring(1)
        }

        if ( v.charAt(0) == `$` ){
            return `var(--${v.replace(`$`, ``)})`
        }

        if ( 
            /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(`#${v}`) ||
            /^#([0-9A-F]{3}){1,2}$/i.test(`#${v}`)
        ){
            return `#${v}`
        }
        
        else if ( v.includes(`rgb`) || v.includes(`rgba`) ){
            return v.replace(/\[/g, `(`).replace(/\]/g, `)`)
        }
        else
            return v.trim()
    }

    private parseGradient(val: string): string {

        if ( val.startsWith(`gradient`) ){
            val = `linear-${val}`
        }

        //linear-gradient-to-bottom-blue-green
        const [ 
            _gtype, 
            _xyz,
            _gto, 
            _gdeg,
            ..._colors
        ] = val.split(`-`)

        let value = val
        const _gdegree = /^[+-]?\d+(\.\d+)?$/.test(_gdeg) ? `${_gdeg}deg` : `to ${_gdeg}`
        const _gcolors = _colors.reduce((arr: string[], val: string) => {
            arr.push(this.makeColor(val))
            return arr
        }, [] as string[]).join(`, `)

        switch(_gtype){
            case `linear`:
                value = `linear-gradient(${_gdegree}, ${_gcolors})`
                break;
            case `radial`:
                // value = `radial-gradient(${_gparts[1]})`
                break;
            default:
                value = val
                break;
        }

        return value
    }

    private generateHash(str: string, length: number = 6): string {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) {
            // (hash * 33) + charCode
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
        }
        /**
         * Bitmasking to shorten:
         * 0xFFFFF (20 bits) gives ~1 million unique combinations (usually 4 chars in base36)
         * 0xFFFFFF (24 bits) gives ~16 million unique combinations (usually 5 chars in base36)
         */
        const maskedHash = (hash >>> 0) & 0xFFFFF; 
        
        return maskedHash.toString(36).padStart(length, '0');
    }

    public getStyleSheet(): string {
        return Array.from(this.cache.values()).join("\n");
    }

    public getCache() : Map<string, string> {
        return this.cache
    }

    public clearFileCache(filePath: string) {
        // We don't delete from this.cache immediately (to avoid re-generating common utilities)
        // But we reset what the file is "claiming" as its styles
        this.fileMap.delete(filePath);
        this.rawRuleMap.delete(filePath);
    }

    public registerRawRule(filePath: string, cssRule: string) {
        const rule = (cssRule || "").trim();
        if (!rule) return;

        if (!this.rawRuleMap.has(filePath)) {
            this.rawRuleMap.set(filePath, new Set());
        }

        this.rawRuleMap.get(filePath)!.add(rule);
    }

    /**
     * Builds the generated CSS as an in-memory string. Pure computation only —
     * no filesystem access — so this stays safe to import from browser bundles.
     * CLI/build tooling that needs to persist this to disk should use
     * `writeStylesToDisk` from `./write-styles` instead of touching fs here.
     */
    public getOutput(): string {
        // 1. Identify all hashes currently in use across all files
        const activeHashes = new Set<string>();
        this.fileMap.forEach(hashes => {
            hashes.forEach(h => activeHashes.add(h));
        });

        // 2. Filter the cache for only active rules
        const activeRules: string[] = [];
        activeHashes.forEach(hash => {
            if (this.cache.has(hash)) {
                activeRules.push(this.cache.get(hash)!);
            }
        });

        const rawRules: string[] = [];
        this.rawRuleMap.forEach((rules) => {
            rules.forEach((rule) => rawRules.push(rule));
        });

        return `/* Zuz Generated CSS */\n\n${activeRules.join("\n")}\n\n${rawRules.join("\n\n")}`;
    }

}

export default new StyleGenerator();