import { dynamic, isColor } from "@zuzjs/core";
import fs from "fs";
import Hashids from "hashids";
import { dirname } from "path";
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

        const trimmedRaw = raw.trim();

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
                ...ctx
            });
        }
        // 2. if it's a known Direct Shortcut (flex, grid, jcc)
        else if (this.directMap[trimmedRaw]) {
            tokens.push({
                prop: trimmedRaw,
                value: undefined, // Directs often don't have a value
                isCustom: false, // This is a Zuz utility!
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

        const { prop, value, pseudo, media, selector, isCustom } = token;

        
        if ( isCustom ){
            return prop
        }
        
        let cssRuleBody = "";

        // 1. If it has a value AND is in propMap, it's a Property (e.g., flex:1)
        // 2. If it has NO value AND is in directMap, it's a Shortcut (e.g., flex)

        if (!value && this.directMap[prop]) {
            cssRuleBody = this.directMap[prop]
            // console.log(`--ppd`, prop, value)
        } 
        else {
            // It's a standard property (w:100, flex:1)
            const cssProp = this.propMap[prop] || prop;
            cssRuleBody = cssProp.includes("__") 
                ? this.resolveComplexTemplate(prop, value || "", cssProp) 
                : `${cssProp}: ${this.processValue(prop, value || "")};`;

            // if ( prop == `x`. )
            // console.log(`--ppp`, prop, value)
            
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

    private transformBrackets(input: string): string {
        return input
            .replace(/\[/g, '(')
            .replace(/\]/g, ')')
            .replace(this.dollorToVarRegexp, 'var(--$1)');
    }

    public addUnitsSafely(prop: string, val: string): string {

        const unitlessProps = [
            "opacity", "zIndex", "flex", "b", "font-weight", "fontWeight", "lineHeight", "scale", "ratio", "aspectRatio", "aspect-ratio",
            "shrink", "flex-shrink", "flexShrink", "line-height", "lh", "lineHeight"
        ];
        // console.log(`--ppop`, prop, val)
        if (unitlessProps.includes(prop)) return val;

        // console.log(`addUnitsSafely`, prop, val)

        // 1. If it's a pure number, just append px
        if (/^-?\d*\.?\d+$/.test(val)) return `${val}${prop == `rotate` ? `deg` : `px`}`;

        /**
         * 2. Advanced Regex for complex strings (calc, repeat, etc.)
         * We want to match numbers but EXCLUDE:
         * - Numbers followed by a unit (100vh)
         * - The first argument in repeat(n, ...) 
         */
        return val.replace(/(?<=^|[\s\+\-\*\/\(\,])(-?\d*\.?\d+)(?=$|[\s\+\-\*\/\)\,])/g, (match, number, offset, fullString) => {
            
            // Look backwards to see if we are inside a repeat() function as the first argument
            const beforeMatch = fullString.substring(0, offset);
            // console.log(`beforeMatch`, beforeMatch.trim())
            if (beforeMatch.trim().endsWith('repeat(')) {
                return match; // Return "5" without "px"
            }

            // Otherwise, add px
            return `${match}px`;
        });
    }

    private processValue(prop: string, val: string): string {
        let isImportant = false;
        if (val.endsWith('!')) {
            isImportant = true;
            val = val.slice(0, -1);
        }

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
            [`xs`, `sm`, `md`, `lg`, `xl`, `xxl`].includes(val.trim())
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
            // console.log(result, pval, sizeMap)
        }

        // If it's a bracketed value (calc, etc.)
        else if (val.includes('[') || val.includes(']')) {
            // Swap symbols and handle variables
            let transformed = this.transformBrackets(val);
            
            const [ _kw ] = val.split(`[`)
            if ( [`rgba`,`rgb`].includes(_kw) ){
                result = transformed
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
        else if (/^-?\d*\.?\d+$/.test(val)) {
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

        return isImportant ? `${result} !important` : result;
    }

    public addUnitsToComplexValue(prop: string, val: string): string {
        // Avoid adding px to things like rgba alphas or z-index
        const unitlessProps = [
            "opacity", "zIndex", "flex", "b", "fontWeight", "lineHeight", 
            "shrink", "flex-shrink", "flexShrink",
        ];
        if (unitlessProps.includes(prop)) return val;

        // Regex looks for numbers that aren't already followed by a unit (%, px, vh, etc.)
        // and aren't part of a variable name
        try{
            return String(val).replace(/(\d+)(?![%a-zA-Z!])/g, '$1px');
        }
        catch(e) {
            // console.log(`addUnitsToComplexValueError`, prop, val, typeof val, e)
            return val
        }
        // return val;
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
    }

    public writeToDisk(outPath: string) {
        // 1. Identify all hashes currently in use across all files
        const activeHashes = new Set<string>();
        // console.log(`fileMap`, this.fileMap)
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

        // 3. Write to file
        const output = `/* Zuz Generated CSS */\n\n${activeRules.join("\n")}`;
        if ( !fs.existsSync(dirname(outPath)) ){
            fs.mkdirSync((dirname(outPath)))
        }
        fs.writeFileSync(outPath, output);

    }

}

export default new StyleGenerator();