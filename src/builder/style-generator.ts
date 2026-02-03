import Hashids from "hashids";
import pc from "picocolors";
import { 
    cssProps, 
    cssDirect,
    cssPropsWithColor,
    cssAnimationCurves
} from "./stylesheet.js";
import fs from "fs"
import { dirname } from "path";


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

    constructor() {
        this.hashids = new Hashids(this.__SALT, 5);
    }

    /**
     * Entry point: Converts "w:100 &hover(bg:red)" into class names
     */
    public parseAndGenerate(rawString: string, filePath: string) : string[] {
        
        
        // // 1. SILENT EXIT: If we've already parsed this exact string (e.g., "w:100"), stop.
        // if (this.processedStrings.has(rawString)) return [];
        
        const tokens = this.tokenize(rawString);
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
        const tokens: UtilityToken[] = [];
        let i = 0;

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
                        nextCtx.pseudo = raw.replace('&', '');
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

        // 1. if it's a standard property (w:100)
        if (trimmedRaw.includes(':')){
            const [prop, value] = trimmedRaw.split(':');
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
        
        // 1. Resolve the CSS body first
        if (!value && this.directMap[prop]) {
            const template = this.directMap[prop];
            cssRuleBody = template.includes("__") 
                ? this.resolveComplexTemplate(prop, value || "", template) 
                : template;
        } else {
            // It's a standard property (w:100, flex:1)
            const cssProp = this.propMap[prop] || prop;
            const processedVal = this.processValue(prop, value || "");
            cssRuleBody = `${cssProp}: ${processedVal};`;
        }

        // 2. Create a "Universal Key" based on the actual CSS and modifiers
        // This is the "secret sauce" to deduplication
        const universalKey = `${cssRuleBody}|${pseudo || ''}|${media || ''}|${selector || ''}`;

        // 3. Check if we've already generated a hash for this EXACT CSS behavior
        if (this.ruleTracker.has(universalKey)) {
            return this.ruleTracker.get(universalKey)!;
        }

        // 4. Generate Hash based on the CSS behavior
        const hash = `z${universalKey.charAt(0)}${this.hashids.encode(this.stringToPositionalSum(universalKey))}`;
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
                .replace("__CURVE__", this.animationCurves[curve] || "ease-in-out")
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
        return result.replace("__VALUE__", this.processValue(prop, parts[0] || ""));
    }

    private processValue(prop: string, val: string): string {
        
        let isImportant = false;
        if (val.endsWith('!')) {
            isImportant = true;
            val = val.slice(0, -1);
        }

        let result = "";

        // 1. Comma Logic
        if (val.includes(',') && !val.includes('[')) {
            const joined = val.split(',').map(part => this.processValue(prop, part.trim())).join(' ');
            return isImportant ? `${joined} !important` : joined;
        }

        // 2. Variable Replacement ($var)
        if (val.includes('$')) {
            result = val.replace(/\$([a-zA-Z0-9_-]+)/g, 'var(--$1)');
        } 
        // 3. UNIT CHECK FIRST (Avoids matching '300' as a color)
        else if (/^-?\d*\.?\d+$/.test(val)) {
            result = this.addUnitsToComplexValue(prop, val);
        }
        // 4. COLOR CHECK (Only if it's 3/6 chars and NOT a pure number)
        else if (/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(val)) {
            result = `#${val}`;
        }
        // 5. Bracket/Function Logic
        else if (val.includes('[') && val.includes(']')) {
            let processed = val.replace(/\$([a-zA-Z0-9_-]+)/g, 'var(--$1)');
            processed = processed.replace(/\[/g, '(').replace(/\]/g, ')');
            result = this.addUnitsToComplexValue(prop, processed);
        } 
        else {
            result = val;
        }

        return isImportant ? `${result} !important` : result;
    }

    private addUnitsToComplexValue(prop: string, val: string): string {
        // Avoid adding px to things like rgba alphas or z-index
        const unitlessProps = ["opacity", "zIndex", "flex", "fontWeight", "lineHeight"];
        if (unitlessProps.includes(prop)) return val;

        // Regex looks for numbers that aren't already followed by a unit (%, px, vh, etc.)
        // and aren't part of a variable name
        return val.replace(/(\d+)(?![%a-zA-Z!])/g, '$1px');
    }

    private parseGradient(val: string): string {
        // Ported from your existing logic
        const parts = val.split("-");
        // Simplified: logic to build linear-gradient(...)
        return `linear-gradient(${parts.slice(1).join(", ")})`;
    }

    private stringToPositionalSum(str: string): number {
        return str.split("").reduce((acc, char, i) => acc + char.charCodeAt(0) + i, 0);
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