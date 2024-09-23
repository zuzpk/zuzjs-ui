import Hashids from "hashids";
import { cssProps } from "./stylesheet.js";
import { dynamicObject } from "../types/index.js";
import { FIELNAME_KEY, isColor, isHexColor, isNumber, LINE_KEY, removeDuplicatesFromArray } from "./index.js";
import { nanoid } from "nanoid";
import path from "path";

class CSS {

    unit: any
    PROPS: {

        [x: string]: any,
        alignContent: string; alignItems: string; alignSelf: string
        //Animations
        animation: string; animationDelay: string; animationDirection: string; animationDuration: string; animationFillMode: string; animationIterationCount: string; animationName: string; animationPlayState: string; animationTimingFunction: string
        //Backgrounds
        background: string; backgroundColor: string; backgroundImage: string; backgroundOrigin: string; backgroundPosition: string; backgroundRepeat: string; backgroundSize: string; backfaceVisibility: string; backgroundAttachment: string; backgroundBlendMode: string; backgroundClip: string
        //Borders
        border: string; borderBottom: string; borderBottomColor: string; borderBottomStyle: string; borderBottomWidth: string; borderCollapse: string; borderColor: string; borderImage: string; borderImageOutset: string; borderImageRepeat: string; borderImageSlice: string; borderImageSource: string; borderImageWidth: string; borderLeft: string; borderLeftColor: string; borderLeftStyle: string; borderLeftWidth: string; borderRight: string; borderRightColor: string; borderRightStyle: string; borderRightWidth: string; borderSpacing: string; borderStyle: string; borderTop: string; borderTopColor: string; borderTopStyle: string; borderTopWidth: string; borderWidth: string
        //Radius
        borderRadius: string; borderTopLeftRadius: string; borderTopRightRadius: string; borderBottomLeftRadius: string; borderBottomRightRadius: string; bottom: string; boxDecorationBreak: string; boxShadow: string; boxSizing: string; captionSide: string; caretColor: string; "@charset": string; clear: string; clip: string; clipPath: string; color: string; columnCount: string; columnFill: string; columnGap: string; colGap: string; columnRule: string; columnRuleColor: string; columnRuleStyle: string; columnRuleWidth: string; columnSpan: string; columnWidth: string; columns: string; content: string; counterIncrement: string; counterReset: string; cursor: string; pointer: string; direction: string; display: string; emptyCells: string; filter: string; flex: string; flexBasis: string; flexDirection: string; flexFlow: string; flexGrow: string; flexShrink: string; flexWrap: string; float: string; font: string; fontFamily: string; fontKerning: string; fontSize: string; fontSizeAdjust: string; fontStretch: string; fontStyle: string; fontVariant: string; bold: string; fontWeight: string; gap: string; grid: string; gridArea: string; gridAutoColumns: string; gridAutoFlow: string; gridAutoRows: string; gridColumn: string; gridColumnEnd: string; gridColumnGap: string; gridColumnStart: string; gridGap: string; gridRow: string; gridRowEnd: string; gridRowGap: string; gridRowStart: string; gridTemplate: string; gridTemplateAreas: string; gridTemplateColumns: string; gridTemplateRows: string; hangingPunctuation: string; hyphens: string; isolation: string; justifyContent: string; left: string; letterSpacing: string; lineHeight: string; listStyle: string; listStyleImage: string; listStylePosition: string; listStyleType: string; aspectRatio: string
        //Margin
        margin: string; marginBottom: string; marginLeft: string; marginRight: string; marginTop: string
        //Height
        height: string; minHeight: string; maxHeight: string
        //Width
        width: string; minWidth: string; maxWidth: string; mixBlendMode: string; objectFit: string; objectPosition: string; opacity: string; order: string; outline: string; outlineColor: string; outlineOffset: string; outlineStyle: string; outlineWidth: string; overflow: string; overflowX: string; overflowY: string; padding: string; paddingBottom: string; paddingLeft: string; paddingRight: string; paddingTop: string; pageBreakAfter: string; pageBreakBefore: string; pageBreakInside: string; perspective: string; perspectiveOrigin: string; pointerEvents: string; position: string; quotes: string; resize: string; right: string; scrollBehavior: string; tabSize: string; tableLayout: string; align: string; textAlign: string; textAlignLast: string; textDecoration: string; textDecorationColor: string; textDecorationLine: string; textDecorationStyle: string; textIndent: string; textJustify: string; textOverflow: string; textShadow: string; textTransform: string; top: string; transform: string; "transform(2D)": string; "transformOrigin(twoValue syntax)": string; transformStyle: string; transition: string; transitionDelay: string; transitionDuration: string; transitionProperty: string; transitionTimingFunction: string; unicodeBidi: string; userSelect: string; verticalAlign: string; visibility: string; whiteSpace: string; wordBreak: string; wordSpacing: string; textWrap: string; wordWrap: string; writingMode: string; zIndex: string; backdropFilter: string
    }
    DIRECT: { [x: string] : any, fill: string; abc: string }
    IGNORE: string[]
    chars: string
    hashids: any
    cx: string[]
    cache: { [x: string] : any }
    pseudoRegExp: RegExp;
    pseudoList: string[];
    pseudoCounter: { [key: string] : number };
    pseudoPattern: string;
    pseudoReg: RegExp;
    propCounter: dynamicObject;
    keysWithoutCommaToSpace: string[];
    rgbaRegex: RegExp;
    seperator: string;
    buildCache: dynamicObject;
    // classCounter: number;
    classLine: string;

    constructor(options?: { [x: string]: any } | undefined){
        const opts = options || {}
        this.unit = opts.unit || `px`
        this.hashids = new Hashids('', 4)
        this.chars = "#abcdefghijklmnopqrstuvwxyz0123456789"
        this.seperator = `__@@__`
        this.PROPS = cssProps
        this.IGNORE = [
            `flex`, `opacity`, `z-index`, `zIndex`, `color`, `line-height`, `anim`, `scale`
        ]
        this.DIRECT = {
            "extend": "@extend .__VALUE__;",
            "content": "content:'';",
            "bold": "font-weight: bold;",
            "flex": "display:flex;",
            "cols": "flex-direction:column;",
            "ass": "align-self:flex-start;",
            "ais": "align-items:flex-start;",
            "aib": "align-items:baseline;",
            "aic": "align-items:center;",
            "aie": "align-items:flex-end;",
            "jcs": "justify-content:flex-start;",
            "jcc": "justify-content:center;",
            "jce": "justify-content:flex-end;",
            "jcb": "justify-content:space-between;",
            "jca": "justify-content:space-around;",
            "tal": "text-align: left;",
            "tac": "text-align: center;",
            "tar": "text-align: right;",
            "tas": "text-align: justify;",
            "fill": "top: 0px;left: 0px;right: 0px;bottom: 0px;",
            "rel": "position:relative;",
            "abs": "position:absolute;",
            "fixed": "position:fixed;",
            "abc": "top: 50%;left: 50%;transform: translate(-50%, -50%);",
            "tdn": "text-decoration:none;",
            "tdu": "text-decoration:underline;",
            "nous": "user-select:none;",
            "nope": "pointer-events:none;",
            "ph": "padding-left:__VALUE__;padding-right:__VALUE__;",
            "pv": "padding-top:__VALUE__;padding-bottom:__VALUE__;",
            "mh": "margin-left:__VALUE__;margin-right:__VALUE__;",
            "mv": "margin-top:__VALUE__;margin-bottom:__VALUE__;",
            "translate": "transform:translate(__VALUE__);",
            "translateX": "transform:translateX(__VALUE__);",
            "translateY": "transform:translateY(__VALUE__);",
            "rotate": "transform: rotate(__VALUE__);",
            "scale": "transform: scale(__VALUE__);",
            "anim": "transition: all __VALUE__ linear 0s;",
            "hide" : "display: none;",
        }
        this.keysWithoutCommaToSpace = [
            `transform`, `translate`, `color`, `background`, `background-color`, `backgroundColor`,
            `border`, `border-bottom`, `border-top`, `border-left`, `border-right`
        ]

        this.propCounter = {}
        this.cx = []
        this.cache = {}
        this.buildCache = {}

        this.classLine = ``
        // 1. this.baseRegex = /(\$?[\w%!-]+:\$?[\w%!-]+(?:,[-\w%!.]+)*)|(\$?[\w%!-]+:\$?[-\w%,.!]+)/g;
        // 2. this.baseRegex = /(\$?[\w%!-]+:\$?\w+\[(.*?)\]+)|(\$?[\w%!-]+:\$?[-\w%,.!]+|\$?[-\w%,.!]+)/g;
        // 3. this.baseRegex = /(\$?[\w%!-]+:\$?[\w%!-]+(?:\[[^\]]*\])?(?:,[^\s,]+)*)|(\$?[\w%!-]+:\$?[-\w%,.!]+|\$?[-\w%,.!]+)/g;
        // let __baseRegex = /\$?\b\w+:\$?(?:\d+(\.\d+)?%?|\w+\[[^\]]*\]|[-\w%!,.]+|[\w%!-]+)/g
        // const _any = `([^\\s]+)`
        // const _bracketWord = `\\w+\\[[^\\]]*\\]`
        // // const __number = `\\-?\\d+(\\.\\d+)?%?(?:[[a-z]+]?)?`
        // // (?:\.?|\d+)?
        // const _number = `\\-?\\d*(\\.\\d+)?%?(?:[[a-z]+]?)?`
        // const _baseRegex = `\\$?\\b\\w+:(?:`+
        //         `\\$?${_number},?${_number}?` + // 50|50%|50.5
        //         `|\\$?${_bracketWord}` + // calc[12 - 22] | color:rgba[255,255,255,0.5] 
        //         `|(?:${_any},${_any},${_any}\\b)` +
        //         // `|(?:${_number},${_number},${_number},${_number})` +
        //         // `|(?:${_number}[,${_number}]?)` +
        //         `|\\$?[\\w-]+` +
        //     `)!?`
        // console.log(_baseRegex)
        // this.baseRegex = new RegExp(_baseRegex, `g`)
        this.rgbaRegex = /\b\w+\[\d+,\d+,\d+(?:,\d+)?\]/g;
        this.pseudoList  = [
            "@before", "@after", "@active", "@checked", "@default", "@disabled", "@empty", "@enabled", "@first", "@firstChild", "@firstOfType", "@focus", "@hover", "@indeterminate", "@inRange", "@invalid", "@lastChild", "@lastOfType", "@link", "@not", "@nthChild", "@nthLastChild", "@nthLastOfType", "@nthOfType", "@onlyChild", "@onlyOfType", "@optional", "@outOfRange", "@readOnly", "@readWrite", "@required", "@root", "@scope", "@target", "@valid", "@visited"
        ]
        this.pseudoCounter = {}
        this.pseudoList.map((p:string) => this.pseudoCounter[p] = 0)
        this.pseudoPattern = this.pseudoList.map((word: string) => word).join('|');
        this.pseudoReg = new RegExp(this.pseudoPattern, `g`)
        // this.pseudoRegExp = /&(\w+)\(\s*([^()]*?(?:\([^()]*\))*[^()]*)\s*\)/g
        this.pseudoRegExp = /(?:&|.)(\w+)\(\s*([^()]*?(?:\([^()]*\))*[^()]*)\s*\)/g
        
    }

    cleanKey(key: string) : string{
        return key.split(this.seperator)[0].replace(`@`, ``)    
    }

    getStyleSheet(cache: dynamicObject ) : string {
        const self = this    
        const scss : string[] = []
        const mainKeys : string[] = [] //Object.keys(cache).map(k => self.cleanKey(k))
        // self.buildCache = {...self.buildCache, ...cache}

        // console.log(self.classLine)

        const extractMasterKeys = ( key: string, value : string | dynamicObject ) => {
            const baseKey = self.cleanKey(key);
            if ( `string` === typeof value ){
                if ( !mainKeys.includes(baseKey) ){
                    scss.push(`.${baseKey}{${value}}`)
                    mainKeys.push(baseKey)
                }
            }
            else {
                for( const prop in value ){
                    extractMasterKeys(prop, value[prop])
                }
            }
        }

        const build = ( key: string, value : string | dynamicObject, level = 0 ) => {
            const baseKey = self.cleanKey(key)
            let css = `${self.pseudoList.includes(`@${baseKey}`) ? `&:${baseKey}` : `${baseKey.includes(`.`) ? `` : `.`}${baseKey}`}{` 
            if ( `object` === typeof value ){
                const _extend : string[] = []
                for (const prop in value){
                    if ( `string` === typeof value[prop] ){
                        _extend.push(`.${prop}`)
                        // _extend.push(self.buildCache[prop])
                    }
                }
                
                if ( _extend.length > 0 )
                    // css += _extend.join(``)
                    css += `@extend ${_extend.join(`, `)};`

                for (const prop in value){
                    if ( `object` === typeof value[prop] ){
                        css += build(prop, value[prop], level + 1)
                    }
                }
            }
            css += `}`
            return css
        }

        /**
         * Extract LINE_KEY
         */
        for ( const key in cache ){
            if ( key.startsWith(LINE_KEY) ){
                scss.push(cache[key])
                delete cache[ key ]
            }
        }

        /**
         * Build Extends
         */
        for ( const key in cache ){
            if ( `object` == typeof cache[key] ){
                scss.push(build(key, cache[key]))
            }
        }

        /**
         * Build Master Keys
         */
        for ( const key in cache ){
            if ( key == FIELNAME_KEY ){
                // scss.push(`/**\n* @file ${cache[key]}\n*/`)
                continue
            }
            extractMasterKeys(key, cache[key])
        }

        scss.push(self.classLine)

        return scss.join(`\n`)
    }

    ggetStyleSheet(cache: dynamicObject ) : string {
        
        const self = this    
        let scss = self._getStyleSheet(cache)

        // console.log(self.buildCache)
        // Object.keys(self.buildCache).forEach((key: string) => scss += `object` == typeof self.buildCache[key] ? JSON.stringify(self.buildCache[key]) : `\n${self.buildCache[key]}`)
        Object.keys(self.buildCache).forEach((key: string) => scss += `\n${self.buildCache[key]}`)
        // Object.keys(self.buildCache).forEach((key: string) => console.log(self.buildCache[key]))
        
        return scss.trim()

    }

    _getStyleSheet(cache: dynamicObject) : string {
        const self = this    
        let scss = ``

        console.log(cache)

        const _getExtends = (ca : dynamicObject, pseudo = ``) : string => {
            const _extend : string[] = []
            // console.log(`extending`, pseudo, ca)
            Object.keys(ca).forEach((k: string) => {
                if ( !k.startsWith(`.`) )
                    _extend.push(`${k.startsWith(`.`) ? `` : `.`}${this.cleanKey(k)}`)
            })
            // if ( _extend.includes(`.before`) ) console.log(_extend, ca)
            return _extend.length > 0 ? `@extend ${_extend.join(`,`)}` : ``
        }

        Object.keys(cache).forEach((key: string) => {

            const ca = cache[key]
            const hasDot = key.startsWith(`.`)

            if ( `object` == typeof ca ){

                const _k = self.cleanKey(key)
                const _pseudo = self.pseudoList.find(x => x == `@${_k}`)

                scss += `${_pseudo ? `&:${_pseudo.replace(`@`, ``)}` : `\n${hasDot ? `` : `.`}${_k}`}{`

                console.log()

                // if ( `object` == typeof ca ){
                // Object.keys(ca).forEach((ke: string) => {
                
                //     const ac = ca[ke]
                //     const kc = self.cleanKey(ke)
                //     const psudo = self.pseudoList.find(x => x == `@${kc}`)

                //     if ( psudo ){
                //         scss += self._getStyleSheet({ [ke] : ac })
                //     }
                //     else {
                //         if ( `object` == typeof ac ){
                //             scss += self._getStyleSheet(ac)
                //         }
                //         else{
                //             console.log(`_ext`, ac)
                //             scss += `\n${_getExtends(ac)};`
                //         }
                //     }

                // })
                // scss += self._getStyleSheet(ca)
                // }
                // else{
                //     scss += `ola${ca}`
                // }

                scss += `}`

            }
            else{
                const k = `${hasDot ? `` : `.`}${key}`
                if ( k in self.buildCache === false ){
                    self.buildCache[k] = `${k}{${cache[key]}}`
                }
            }

        })

        return scss
    }

    cleanPseudo( cache: dynamicObject ) {
        
        const self = this
        const _ : dynamicObject = {}

        Object.keys(cache).map((_k: string) => {
            // console.log(`cleanPseudo`, _k, cache[_k])
            // if ( )
            const __k = _k.split(self.seperator)[0]
            if ( _k.startsWith(`.`) && !self.pseudoList.find(x => x == `@${__k.replace(`.`, ``)}`) ){
                _[__k] = cache[_k] //[Object.keys(cache[_k])[0]]
                // console.log(_k, cache[_k])  
            }
            else if ( `object` == typeof cache[_k] ){
                const _id = self.makeIDFromObject(_k, cache[_k])
                if ( !_[_id] ){
                    self.cx.push(_id)
                    _[_id] = { [_k] : cache[_k] }
                }
                // if ( _[_id] ) console.log(`cleanPseudo`, _id, `is duplicate`, _[_id])
                // console.log(`cleanPseudo`, _id, _k, cache[_k])
            }
            else{
                // console.log(`-cleanPseudo`, _k, cache[_k])
                _[_k] = cache[_k]
            }
        })

        // console.log(`cleanedPseudo`, _)

        return _

    }

    makeColor(){

    }

    makeUnit(k : string, v : any){
        // console.log(`unit`, k, v)
        if( k == `rotate` ){
            return `deg`
        }
        if( typeof v == "string" && (!isNumber(v) || this.IGNORE.indexOf(k) > -1) )
            return ``
        return this.unit;
    }

    makeValue(k: string, v: any){

        if(k in this.PROPS){
            const key = this.PROPS[k]
            let value;

            v = v.trim() //.replace(`\``, ``)

            let hasImportant = v.charAt(v.length-1) == `!`
            v = hasImportant ? v.slice(0, -1) : v
            let important = hasImportant ? ` !important` : ``

            // if ( key.includes(`opacity`)) console.log(`makevalue`, key, k, v)

            /**
             * Variable
             */
            if ( v.charAt(0) == `$` ){
                value = `var(--${v.replace(`$`, ``)})`
                
            }

            else if ( v.trim() == `transparent` ){
                value = `rgba(0,0,0,0)`
            }

            /**
             * border
             */
            else if ( [ `border`, `borderBottom`, `borderTop`, `borderLeft`, `borderRight` ].includes(k) ){
                const _parts : string[] = [] 
                // console.log(`--border`, key, v)
                if( v.match(this.rgbaRegex) ){
                    _parts.push(v.match(this.rgbaRegex)[0].replace(`[`, `(`).replace(`]`, `)`))
                    v = v.replace(this.rgbaRegex, ``).trim().replace(`,,`, `,`)
                }
                // console.log(`-border`, key, v, _parts)
                v.split(`,`).map((p:string) => {
                    if ( p.includes(`rgb`) || p.includes(`rgba`) || isColor(`#${p}`) || p.startsWith(`$`) ){

                        if ( p.includes(`rgb`) || p.includes(`rgba`) ){
                            _parts.push(p.replace(`[`, `(`).replace(`]`, `)`))
                        }
                        else{
                            if ( p.charAt(0) == `#` ){
                                p = p.substring(1)
                            }
                            _parts.push(
                                isHexColor(`#${p}`) ? `#${p}` 
                                    : p.startsWith(`$`) ? `var(--${p.replace(`$`, ``)})` : p                            
                            )
                        }
                    }
                    else if ( isNumber(p) ){
                        _parts.push(`${p}${this.makeUnit(`border`, p)}`)
                    }
                    else if ( [ 'none', 'hidden', 'dotted', 'dashed', 'solid', 'double', 'groove', 'ridge', 'inset', 'outset' ].includes(p) ){
                        _parts.push(p)
                    }
                })
                value = _parts.join(` `)
                // console.log(`border`, value)             
            }

            /**
             * Color
             */
            else if ( [`color`, `bg`, `background`, `background-color`, `backgroundColor`].includes( key  ) ){
            // else if ( [`color`].includes( key  ) ){

                if ( v.charAt(0) == `#` ){
                    v = v.substring(1)
                }

                if ( 
                    /^#[0-9A-F]{6}[0-9a-f]{0,2}$/i.test(`#${v}`) ||
                    /^#([0-9A-F]{3}){1,2}$/i.test(`#${v}`)
                ){
                    value = `#${v}`
                }
                
                else if ( v.includes(`rgb`) || v.includes(`rgba`) ){
                    value = v.replace(`[`, `(`).replace(`]`, `)`)
                }
                else
                    value = v.trim()
                

                
            }

            /**
             * FontWeight
             */
            else if ( key == `font-weight` ){
                value = v
            }

            /**
             * value with brackets like calc(), var() should be passed as calc[value]
             */
            else if (v.match(/\[(.*?)\]/g)){
                try{
                    const vs = v.match(/\[(.*?)\]/g)[0].slice(1, -1)
                    const [ _vc ] = v.split(`[`)
                    value = `${_vc.trim()}(${vs})`
                }catch(e){}
            }

            else {
                // ${v.charAt(0) == `$` ? `var(--${v.substring(1)})` : v}
                // if ( key.includes(`padding`) ) console.log(`->padding`, v)
                
                if ( v.includes(`,`) ){
                    // console.log(`vwithcomma`, v)
                    let __v : string[] = []
                    v.split(`,`).map((_:string) => {
                        if ( _.startsWith(`$`) ){
                            __v.push(`var(--${_.substring(1)})`)
                        }
                        else{
                            // console.log(`comma`, key, v, this.makeUnit(key, v))
                            __v.push(`${_}${this.makeUnit(key, _)}`)
                        }
                    })
                    value = __v.join(` `)
                }
                else
                    value = `${v}${this.makeUnit(key, v)}`
            }

            if ( !value )
                return ``
            
            // if ( key == `background` ) console.log(`makevalue`, key, value)
            // if ( key.includes(`border`) ) console.log(`--border`, `${key}: ${value}${important};`)
            value = value.includes(`,`) && !this.keysWithoutCommaToSpace.includes(key) ? value.replace(`,`, ` `) : value

            // if ( key.includes(`padding`) ) console.log(`->padding`, `${key}: ${value}${important};`)
            if ( key == `content` ) value = `"${value}"`

            return `${key}: ${value}${important};`
        }

        return ``
    }

    makeID(k: string, v: string, _out: string){
        const self = this;
        const _css = _out.toString().replace(/;|:|\s/g, "")           
        let _indices = 0
        for(let i = 0; i < _css.length; i++){ _indices += self.chars.indexOf(_out.charAt(i)) }    
        let _cp = k.substring(0, 1);
        if(self.PROPS[k]?.indexOf("-") > -1){
            _cp = "";
            self.PROPS[k].split("-").map((c: string) => _cp += c.substring(0, 1))
        }
        if(v.toString().indexOf("-") > -1){
            v.toString().split("-").map(c => _cp += c.substring(0, 1))
        }
        return `${_cp}${self.hashids.encode((self.PROPS[k] ? self.PROPS[k].length : 0)+ _indices + (isNaN(parseInt(v)) ? 0 : parseInt(v)))}`.replace(/\s|\$/g, '-')       
    }

    makeIDFromObject( key: string, obj: dynamicObject ){

        const self = this
        const out = [ key ]

        const fcs : string[] = [ key.charAt(0) ]
        const vals : string[] = [  ]

        const build = (o: dynamicObject) => {
            Object.keys(o).map((n:string) => {
                if ( `object` == typeof o[n] ){
                    build(o[n])
                }
                else{
                    fcs.push(n.charAt(0))
                    vals.push(o[n])
                }
            })
        }

        build(obj)

        let _indices = 0
        let _cp = ""

        for( const ot of vals ){
            const _css = ot.toString().replace(/;|:|\s/g, "")           
            for(let i = 0; i < _css.length; i++){ _indices += self.chars.indexOf(ot.charAt(i)) }    
            if(ot.indexOf("-") > -1){
                ot.split("-").map((c: string) => _cp += c.substring(0, 1))
            }
        }

        return `${_cp}${self.hashids.encode(_indices)}`.replace(/\s/g, '-')

    }

    parseRawLine(line: string) : dynamicObject {

        const self = this;
        const result : dynamicObject = {};

        try{

            const matches = line.match(self.pseudoRegExp)
            if ( matches ){
                // if ( line.includes(`opacity`) ) console.log(`matches`, matches)
                matches.map((m:string) => {
                    const pseudo = self.pseudoRegExp.exec(m) ///&\w+/g.exec(m)
                    // if ( m.includes(`opacity`) ) console.log(`pseudo`, m, pseudo)
                    if ( pseudo ){
                        const _kw = pseudo[1] in self.propCounter ? ++self.propCounter[pseudo[1]] : self.propCounter[pseudo[1]] = 1
                        const psd = `${self.pseudoList.includes(`@${pseudo[1]}`) ? `` : `.`}${pseudo[1]}${this.seperator}${_kw}`
                        result[psd] = self.parseRawLine(pseudo[2])
                    }
                    line = line.replace(self.pseudoRegExp, ``)
                })
            }

            // if ( line.includes(`opacity`) ) console.log(`matches`, result)

            let word = ``
            let hasBracket = false

            const processWord = () => {
                word = word.replace(/(`|{|})/g, ``)
                const _kw = word in self.propCounter ? ++self.propCounter[word] : self.propCounter[word] = 1

                if ( word.includes(`:`) ){

                    const [ key, value ] = word.split(`:`)
                    const _kk = key in self.propCounter ? ++self.propCounter[key] : self.propCounter[key] = 1
                    

                    result[`${key}${_kk}${value}`.trim()] = `${key}:${value}`.trim()

                    // if (value) {
                        
                    // } else {
                    //     result[`${word}${_kk}`] = word // true;
                    // }
                }
                else{
                    result[`${word}${_kw}`.trim()] = word.trim();
                }
                word = ``
            }

            // console.log(line.trim().split(``))
            line.trim().split(``)
                .map(char => {
                    if ( char == ` ` && word != `` && !hasBracket) {
                        processWord()
                    }
                    else{
                        word += char
                        if ( char == `[` ) hasBracket = true
                        if ( char == `]` && hasBracket ) hasBracket = false                        
                    }
                })

            if ( word != `` ) processWord()
                            

            // line = line.charAt(0) == `\`` ? line.substring(1) : line
            // line = line.charAt(line.length - 1) == `\`` ? line.substring(0,) : line

            // if ( line.includes(`opacity`) )
                // console.log(`oppc`, line)

            // const baseProperties = line.match(self.baseRegex);

            // if (baseProperties) {

            //     // console.log(line, baseProperties)

            //     baseProperties.forEach(prop => {
            //         const [key, value] = prop.split(':');
            //         if (value) {
            //             if ( result[key] ){
            //                 const _kk = key in self.propCounter ? ++self.propCounter[key] : self.propCounter[key] = 1
            //                 result[`${key}${_kk}`] = `${key}:${value}`;
            //             }else
            //                 result[key] = `${key}:${value}`;
            //         } else {
            //             const _kk = prop in self.propCounter ? ++self.propCounter[prop] : self.propCounter[prop] = 1
            //             result[`${prop}${_kk}`] = prop // true;
            //         }
            //     });
            // }

            // const extraWords = line.replace(self.baseRegex, ``).match(/(?<!\w|\$|&)[a-zA-Z0-9-]+(?!\w)/g)

            // if ( extraWords ) {
            //     extraWords.map(w => result[w] = w   )
            // }


        }
        catch(e){
            // console.log(e)
        }
        
        // if( line.includes(`gfile`))
        //     console.log(result)

        return result
        
    }

    makeCSS(line: string) : dynamicObject | null {

        const self = this

        if ( line.startsWith(FIELNAME_KEY) ){
            self.cache = { ...self.cache, [FIELNAME_KEY] : line.split(`:`)[1]  }
            return null
        }
        
        else {

            const rest = self.parseRawLine(line)

            // if ( line.includes(`opacity`) ) console.log(line, rest)
            // console.log(rest)

            const value = (_k: string, pseudo = ``) => {

                if( _k in self.DIRECT ){
                    const _out = self.DIRECT[_k]
                    const _id = self.makeID(_k, _k + pseudo, _out)
                    if ( pseudo == `` )
                        self.cx.push(_id)
                    return { [_id] : _out } 
                }
                else if ( _k.includes(`:`) ){

                    const [ key, _val ] = _k.split(`:`)

                    if(key in self.PROPS){
                        const _out = self.makeValue(key, _val)
                        const _id = self.makeID(key, _val + pseudo, _out)
                        if ( pseudo == `` )
                            self.cx.push(_id)
                        return { [_id] : _out } 
                    }
                    else if( key in self.DIRECT ){
                        const hasImportant = _val.endsWith(`!`)
                        const val = hasImportant ? _val.slice(0, -1) : _val
                        const important = hasImportant ? ` !important` : ``
                        const _out = self.DIRECT[key].includes(`__VALUE__`) ? 
                            self.DIRECT[key].replace(/__VALUE__/g, `${val}${self.makeUnit(key, val)}${important}`) : self.DIRECT[key]
                        const _id = self.makeID(key, key + pseudo, _out)
                        if ( pseudo == `` )
                            self.cx.push(_id)
                        return { [_id] : _out } 
                    }

                }            
                else if (_k.trim().match(/^[a-zA-Z0-9\-]+$/g)){
                    self.cx.push(`--${_k.trim()}`)
                }

                return {}
            }

            const build = ( o : dynamicObject, pseudo = `` ) => {
                
                let out : dynamicObject = {}

                Object.keys(o).map((_k : string) => {

                    if ( `object` == typeof o[_k] ){

                        // console.log(_k, o[_k])

                        out = { ...out, [_k] : build(o[_k], _k) } 
                        // self.makeIDFromObject(_k, cache[_k])
                    }
                    else{

                        out = { ...out, ...value(o[_k], pseudo) }
                    }
                
                })

                return out 
            }
            
            // console.log(`rest -> `, rest)
            // console.log(`buildRest ->`, build(rest))
            const _built = build(rest)
            self.cache = { ...self.cache, ..._built }

            let __ : dynamicObject = {}
            for( const key in _built ){
                if ( `object` == typeof _built[key] )
                    __[key] = _built[key]
            }

            return __

        }

        // console.log(self.cache)

    }

    wrappClasses(cx : string[], extras: string[]) : {
        cx: string[],
        css: string | null
    } {
        
        const nx : string[] = []
        const self = this
        const cxs : string[] = []

        let _css : string[] = extras
        let _indices = 0
        
        // console.log(`_pre`, _css)
        // cx.map((k: string) => _css.push(`.${k}`))

        // console.log(`cx`, cx)

        cx.map((k: string) => {
            

            if ( k.startsWith(`--`) ){
                cxs.push(k.substring(2))
                // _css.push(`.${k.substring(2)}`)
            }
            else
                _css.push(`.${k}`)
            
            _indices += self.chars.indexOf(k.charAt(0)) 
            for(let i = 0; i < k.length; i++){ 
                _indices += k[i].charCodeAt(0) + self.chars.indexOf(k[i].charAt(0)) 
            }
        })
            
        let _class = self.hashids.encode(_indices)
        _class = _class.charAt(0).match(/\d/g) ? `z${_class}` : _class
        
        nx.push(_class, ...cxs)

        // console.log(`nx`, nx)

        return {
            cx: nx,
            css: _css.length > 0 ? `.${_class}{ @extend ${_css.reduce((prev: string[], c: string) => {
                prev.push(`${c.startsWith(".") ? "" : "."}${c}`)
                return prev
            }, []).join(`, `)}; }` : null
        }

    }

    Build( css : string | string[][], cli = false ){
        
        let self = this
        self.cx = []
        self.cache = {}
    
        if ( undefined == css ) return {
            cx: self.cx,
            sheet: ``
        }

        if ( `string` == typeof css ){
            css = [[css]]
        }

        let extras : string[]= []

        css.map((arr: string[]) => {
            
            arr.map((line: string) => {

                // if ( cli ) self.cx = []

                const _nestedClasses = self.makeCSS( line )
                // if ( _nestedClasses )
                //     extras = [ ...extras, ...Object.keys(self.cleanPseudo(_nestedClasses)) ]

                // if ( cli ){
                //     // console.log(self.wrappClasses(self.cx, extras))
                //     // const _css = self.wrappClasses(self.cx.filter(x => !x.match(/\$|\?/g) && x != `--` )).css
                //     const _css = self.wrappClasses(self.cx, []).css
                //     if ( _css ){
                //         const _kw = LINE_KEY in self.propCounter ? ++self.propCounter[LINE_KEY] : self.propCounter[LINE_KEY] = 1
                //         const _id = `${LINE_KEY}${self.seperator}${_kw}`
                //         self.cache = { ...self.cache, [_id] : _css }
                //     }
                // }

            })

        })

        // console.log({
        //     cx: self.cx,
        // //     sheet: self.getStyleSheet(self.cleanPseudo(self.cache))
        // })

        // console.log(self.cache)
        // console.log(self.cleanPseudo(self.cache))
        // console.log(self.cx, self.getStyleSheet(self.cleanPseudo(self.cache)))
        // console.log(self.buildCache)
        // console.log(self.cache)

        // console.log(self.classLine, self.wrappClasses(self.cx))

        // const nx = new WrappClasses().build(self.cx)
        // self.cx = []
        
        // console.log(self.cx, self.wrappClasses(self.cx, extras).cx)
        // self.buildCache = {}

        return {
            cx: removeDuplicatesFromArray(self.cx), //[ ...self.wrappClasses(self.cx, []).cx, ...extras ],
            // cx: nx,
            // cx: self.cx,
            sheet: self.getStyleSheet(self.cleanPseudo(self.cache))
        }

    }

}

export default CSS