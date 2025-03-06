import { OptionValues } from "commander"
import Hashids from "hashids"
import md5 from "md5"
import pc from "picocolors"
import { cssShortKey, dynamicObject } from "../types"
import { TRANSITION_CURVES, TRANSITIONS } from "../types/enums.js"
import { __SALT, FIELNAME_KEY, isColor, isHexColor, isNumber, LINE_KEY, setDeep } from "./index.js"
import { cssAnimationCurves, cssDirect, cssFilterKeys, cssProps, cssPropsWithColor, cssTransformKeys, cssWithKeys } from "./stylesheet.js"

class CSS {

    cache: dynamicObject
    PROPS: dynamicObject
    DIRECT: dynamicObject
    IGNORE: string[]
    PROPS_KEYS: string[]
    DIRECT_KEYS: string[]
    cx: string[]
    hashids: Hashids
    chars: string
    rgbaRegex: RegExp
    unit: any
    keysWithoutCommaToSpace: string[]
    propCounter: dynamicObject
    seperator: string
    pseudoList: string[]
    ids: string[]
    DIRECT_VALUES: string[]
    PROPS_VALUES: string[]
    mediaQueries: dynamicObject
    debug: OptionValues | undefined
    _darkQueries: dynamicObject
    _mediaQueries: dynamicObject
    _mediaQueriesLabels: dynamicObject
    _cli: boolean
    _currentFile: string

    constructor(options?: dynamicObject | undefined, debug?: OptionValues){

        const opts = options || {}

        this.debug = debug
        this._cli = false

        this._darkQueries = []
        this._mediaQueries = {}
        this._mediaQueriesLabels = {
            ph: `Extra Small Devices (Phones)`,
            sm: `Small Devices (Tablets)`,
            md: `Medium Devices (Small Laptops)`,
            lg: `Large Devices (Laptops and Desktops)`,
            xl: `Extra Large Devices (Large Desktops)`,
        }
        this.mediaQueries = {
            ph: `(max-width: 599px)`, /* Extra Small Devices (Phones) */
            sm: `(min-width: 600px) and (max-width: 767px)`, /* Small Devices (Tablets) */
            md: `(min-width: 768px) and (max-width: 991px)`, /* Medium Devices (Small Laptops) */
            lg: `(min-width: 992px) and (max-width: 1199px)`, /* Large Devices (Laptops and Desktops) */
            xl: `(min-width: 1200px)`, /* Extra Large Devices (Large Desktops) */
        }
        this.cx = []
        this.cache = {}
        this._currentFile = `?`
        this.unit = opts.unit || `px`

        this.seperator = `__@@__`
        this.hashids = new Hashids(__SALT, 5)
        this.chars = "#@_-[]{}();:^/!^&*+='\"`,.~%abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        this.rgbaRegex = /\b\w+\[\d+,\d+,\d+(?:,\d+)?\]/g;
        this.pseudoList  = [
            "@before", "@after", "@active", "@checked", "@default", "@disabled", "@empty", "@enabled", "@first", "@firstChild", "@firstOfType", "@focus", "@hover", "@indeterminate", "@inRange", "@invalid", "@lastChild", "@lastOfType", "@link", "@not", "@nthChild", "@nthLastChild", "@nthLastOfType", "@nthOfType", "@onlyChild", "@onlyOfType", "@optional", "@outOfRange", "@readOnly", "@readWrite", "@required", "@root", "@scope", "@target", "@valid", "@visited"
        ]
        
        this.IGNORE = [
            `flex`, `opacity`, `z-index`, `zIndex`, `color`, `line-height`, `anim`, `scale`, `saturate`, `brightness`
        ]
        this.keysWithoutCommaToSpace = [
            `transform`, `translate`, `color`, `background`, `background-color`, `backgroundColor`, `backgroundImage`, `background-image`,
            `border`, `border-bottom`, `border-top`, `border-left`, `border-right`,
            `grid-template-rows`, `grid-template-columns`, `grid-auto-rows`, `grid-auto-columns`,
            `clip-path`,`clipPath`,
        ]
        
        this.propCounter = {}
        this.ids = []

        this.PROPS = cssProps
        this.PROPS_KEYS = Object.keys(cssProps)
        this.PROPS_VALUES = this.PROPS_KEYS.reduce((arr: string[], k: string) => {
            arr.push(cssProps[k])
            return arr
        }, [])
        this.DIRECT = cssDirect
        this.DIRECT_KEYS = Object.keys(cssDirect)
        this.DIRECT_VALUES = this.DIRECT_KEYS.reduce((arr: string[], k: string) => {
            if ( !cssDirect[k].includes(`__VALUE__`) )
                arr.push(cssDirect[k].replace(/\s+/g, ``))
            return arr
        }, [])
        
        // extendGlobals()

    }

    buildMediaQueries( queries: dynamicObject ) : string {

        const self = this
        const scss : string[] = [`\n`]

        Object.keys(queries).forEach((key: string) => {
            scss.push(`/**\n*${self._mediaQueriesLabels[key]}\n*/`)
            scss.push(`@media screen and ${self.mediaQueries[key]}{`)
            scss.push(`\t${queries[key].join(`\n\t`)}`)
            scss.push(`}`)
        })

        return scss.join(`\n`)

    }

    buildDarkModeQueries ( queries : dynamicObject ) : string {
        const self = this
        const scss : string[] = [`\n`]
        if ( Object.keys(queries).length > 0 ){
            scss.push(`/**\n*Dark Scheme\n*/`)
            scss.push(`[color-scheme="dark"]{`)
            Object.keys(queries).forEach((key: string) => {
                scss.push(`\t.${key}{${queries[key]}${queries[key].endsWith(`;`) ? `` : `;`}}`);
            })
            scss.push(`}`)
        }
        return scss.join(`\n`)
    }

    styleSheet(cache: dynamicObject, pseudo = ``) : string {
        
        const self = this    
        const scss : string[] = []

        // console.log(cache)

        const build = ( key : string, value: dynamicObject | string ) : string => {
            
            // console.log(`build`, key, value)

            const __build = ( _key : string, _value: dynamicObject | string ) : string => {

                let _css = `${self.pseudoList.includes(`@${_key}`) ? `&:` : `.`}${_key}{`

                if ( `object` == typeof _value ){

                    for ( const prop in _value ){

                        if ( `object` == typeof _value[prop] ){
                            _css += __build(prop, _value[prop])
                        }
                        else{
                            _css += _value[prop]
                        }

                    }

                }
                else {
                    _css += _value
                }
                _css += `}`

                return _css
            }

            let css = ``

            if ( `object` == typeof value && Object.keys(value)[0] in this.mediaQueries ){
                const mq = Object.keys(value)[0]

                // css += `@media screen and ${this.mediaQueries[mq]}{`
                let __css = `.${key}{`

                const _value = value[mq] as dynamicObject

                for ( const prop in _value ){
        
                    if ( `object` == typeof _value[prop] ){
                        __css += __build(prop, _value[prop])
                    }
                    else{
                        __css += _value[prop]
                    }
            
                }

                __css += `}`

                this._mediaQueries[mq] = this._mediaQueries[mq] || []
                this._mediaQueries[mq].push(__css)
                
            }

            // else if ( key in self.mediaQueries ){
                
            // }

            else{               
                css += __build(key, value)
            }

            return css
        }

        for( const key in cache ){

            const base = cache[key]

            if ( key == FIELNAME_KEY ){
                scss.push(`/**\n* @file ${base}\n*/`)
                continue
            }

            else if ( key.startsWith(LINE_KEY) ){
                scss.push(base)
                delete cache[key]
            }

            else{
                const _ = build(key, base)
                if ( !self.ids.includes(_) ){
                    self.ids.push(_)
                    scss.push(_)
                }
            }

        }

        return scss
            .filter(x => x.trim() != `.{}`)
            .join(`\n`)
    }

    _styleSheet(cache: dynamicObject ) : string {
        const self = this    
        const scss : string[] = []
        const mainKeys : string[] = []

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
         * Build Master Keys
         */
        for ( const key in cache ){
            if ( key == FIELNAME_KEY ){
                scss.push(`/**\n* @file ${cache[key]}\n*/`)
                continue
            }
            extractMasterKeys(key, cache[key])
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

        

        // scss.push(self.classLine)

        return scss.join(`\n`)

    }

    cleanKey(key: string) : string{
        return key.split(this.seperator)[0].replace(`@`, ``)    
    }
    
    deepClean( cache: dynamicObject, level = 0 ) {
        
        const self = this
        const _ : dynamicObject = {}

        const oid = ( k: string, value: dynamicObject | string ) => {

            const [ _a, _z ] = k.split(self.seperator)

            const keys : string[] = [_a]

            if ( `object` == typeof value ){
                for ( const o in value ){
                    keys.push(oid(o, value[o]))
                }
            }                

            return keys.join(`-`);
        }

        Object.keys(cache).map((_k: string) => {

            const __k = self.cleanKey(_k)
            if ( 
                `object` == typeof cache[_k] 
            ){

                const _d = oid(_k, cache[_k])
                
                let _indices = 0
                for(let i = 0; i < _d.length; i++){ 
                    _indices += self.chars.indexOf(_d.charAt(i))
                } 
                const _id = `z${self.hashids.encode(_indices)}`

                if ( !_[_id] ){

                    const cleaned = self.deepClean(cache[_k], level + 1)
                    
                    if ( 
                        level == 0 && 
                        (
                            self.pseudoList.includes(`@${__k}`) || 
                            __k in self.mediaQueries || 
                            __k in self._darkQueries
                        )
                    ){
                        self.cx.push(_id)
                        _[_id] = { [__k] :  cleaned }    
                    }
                    else if ( __k !== `dark`)
                        _[__k] = cleaned
                }

            }
            else{
                _[__k] = cache[_k]
            }

        })

        return _
    }

    makeUnit(k : string, v : any){
        // console.log(`unit`, k, v)
        if( [
            `rotate`, `rotateX`, `rotateY`, `rotateZ`,
            `r`, `rx`, `ry`, `rz`,
        ].includes(k) ){
            return `deg`
        }
        if ( cssTransformKeys.includes(k) ) return ``
        if( typeof v == "string" && (!isNumber(v) || this.IGNORE.indexOf(k) > -1) )
            return ``
        
        return this.unit;
    }

    makeColor(v: string){
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
            // console.log(`makeColorrgb[a]`, v)
            return v.replace(/\[/g, `(`).replace(/\]/g, `)`)
        }
        else
            return v.trim()
    }

    makeValue(k: string, v: any){

        const self = this
        
        if(k in this.PROPS){
            const key = this.PROPS[k]
            let value;

            v = v.trim()

            let hasImportant = v.charAt(v.length-1) == `!`
            v = hasImportant ? v.slice(0, -1) : v
            let important = hasImportant ? ` !important` : ``
            let isGradient = v.startsWith(`gradient`) || v.startsWith(`linear-gradient`) || v.startsWith(`radial-gradient`)

            

            /**
             * Gradients
             */ 
            if ( isGradient ){
                if ( v.startsWith(`gradient`) ){
                    v = `linear-${v}`
                }

                //linear-gradient-to-bottom-blue-green
                const [ 
                    _gtype, 
                    _xyz,
                    _gto, 
                    _gdeg,
                    ..._colors
                ] = v.split(`-`)
                
                // const _gdegree = _gdeg.isNumber() ? `${_gdeg}deg` : `to ${_gto}`
                const _gdegree = /^[+-]?\d+(\.\d+)?$/.test(_gdeg) ? `${_gdeg}deg` : `to ${_gdeg}`
                const _gcolors = _colors.reduce((arr: string[], val: string) => {
                    arr.push(self.makeColor(val))
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
                        value = v
                        break;
                }
            }

            /**
             * Variable
             */
            else if ( v.charAt(0) == `$` && !v.includes(`,`) ){
            // else if ( v.match(/\$[a-z0-9-_]+\b(?![\[\],])/g) ){
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
                    // console.log(`mrgb[a]`, v)
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

                const replaceBrackets = (input : string) : string => {
                    const stack = [];
                    const chars = input.split('');
                  
                    for (let i = 0; i < chars.length; i++) {
                      if (chars[i] === '[') {
                        stack.push('('); // Replace '[' with '('
                      } else if (chars[i] === ']') {
                        stack.push(')'); // Replace ']' with ')'
                      } else if (chars[i] === `$`) {
                        let varName = ``
                        i++
                        while( chars[i] && /[a-zA-Z0-9_-]/.test(chars[i]) ){
                            varName += chars[i]
                            i++
                        }
                        i--
                        stack.push(`var(--${varName})`);
                      } else {
                        stack.push(chars[i]); // Push other characters as-is
                      }
                    }                  
                    return stack.join('');
                }

                try{
                    // const vs = v.match(/\[(.*?)\]/g)[0].slice(1, -1)
                    // const [ _vc ] = v.split(`[`)
                    // value = `${_vc.trim()}(${vs})`
                    value = replaceBrackets(v)
                    // console.log(k, `started with []`, replaceBrackets(v))
                }catch(e){}
            }

            else {
                // ${v.charAt(0) == `$` ? `var(--${v.substring(1)})` : v}
                // if ( key.includes(`padding`) ) console.log(`->padding`, v)
                
                // console.log(`rea`, k, v)

                if ( v.includes(`,`) ){
                    // console.log(`vwithcomma`, k, v)
                    let __v : string[] = []
                    const __k = k in cssProps ? cssProps[k] : k
                    v.split(`,`).map((_:string) => {
                        
                        // console.log(`comma`, _, cssPropsWithColor.includes(_) && isColor(`#${_}`))
                        if ( _.charAt(0) == `#` ){
                            _ = _.substring(1)
                        }

                        //Variable
                        if ( _.startsWith(`$`) ){
                            __v.push(`var(--${_.substring(1)})`)
                        }
                        //Color
                        else if ( cssPropsWithColor.includes(_) && isColor(`#${_}`) ){
                        // else if ( isColor(_) ){

                            if ( _.includes(`rgb`) || _.includes(`rgba`) ){
                                __v.push(_.replace(`[`, `(`).replace(`]`, `)`))
                            }
                            else{
                                __v.push(
                                    isHexColor(`#${_}`) ? `#${_}` : _
                                )
                            }
                        }
                        else if ( cssPropsWithColor.includes(__k) && isColor(`#${_}`) ){
                            __v.push(self.makeColor(_))
                        }
                        else{
                            // console.log(`comma`, key, v, this.makeUnit(key, v))
                            __v.push(`${_}${this.makeUnit(key, _)}`)
                        }
                    })
                    value = __v.join(` `)
                    // console.log(key, value)
                    // if( k == `shadow` || k == `box-shadow` ) console.log(value)
                    
                }
                else
                    value = `${v}${this.makeUnit(key, v)}`
            }

            if ( !value )
                return ``
            
            // if ( key.includes(`border`) ) console.log(`--border`, `${key}: ${value}${important};`)
            value = value.includes(`,`) && !this.keysWithoutCommaToSpace.includes(key) ? value.replace(`,`, ` `) : value

            // if ( key == `grid-auto-rows` ) console.log(`makevalue`, key, value)

            // if ( key.includes(`padding`) ) console.log(`->padding`, `${key}: ${value}${important};`)
            if ( key == `content` ) value = `"${value}"`

            
            // if ( key == `grid-template-columns` || key == `grid-cols` ){
            //     console.log(key, value)
            // }

            return `${key}: ${value}${important};`
        }

        return ``
    }

    calcIndexes(str: string) : string{
        let _indices : string[] = []
        for(let i = 0; i < str.length; i++){ _indices.push(this.chars.indexOf(str.charAt(i)).toString()) }    
        return _indices.join(``)
    }

    makeID(k: string, v: string, _out: string){
        
        const self = this;
        const md = md5(_out)
        let _ : any[] = []

        const _mi = (_k: string, _v: string) : number => {

            // console.log(_k, _v, Math.abs(self.DIRECT_KEYS.indexOf(_k)) + Math.abs(self.PROPS_VALUES.indexOf(_k)))

            let i = Math.abs(self.DIRECT_KEYS.indexOf(_k)) + Math.abs(self.PROPS_VALUES.indexOf(_k))
            // _k in self.DIRECT ? self.DIRECT_KEYS.indexOf(_k) : _k in self.PROPS_VALUES ? self.PROPS_VALUES.indexOf(_k) : 0
            _.push(i)
            const nums = _v.match(/[0-9]/g)
            if ( nums ){
                let ii = Math.abs(+nums.join(``))
                _.push(ii)
                i += ii
            }

            const abc = _v.match(/[a-zA-Z,/-\[\]]/g)
            if ( abc ) {
                const ai = abc.reduce((acc, char) => acc + self.chars.indexOf(char), 0)
                _.push(ai)
                i += ai
            }
            return i
        }

        const out = _out.replace(/\s+/g, ``).trim()
        const [ _ok, _ov ] = out.split(`:`)
        const ok = _ok.trim()
        const ov = _ov ? _ov.trim() : v

        if ( ov == `` ){
            console.log(
                pc.yellow(`[${self._currentFile}]`), 
                pc.cyan(k),  
                pc.red(`value is empty.`)
            )
            return ``
            // throw new TypeError()
        } 

        /**Prefix */
        let _cp = ok.charAt(0)
        if(self.PROPS[ok]?.indexOf("-") > -1){
            _cp = "";
            self.PROPS[ok].split("-").map((c: string) => _cp += c.charAt(0))
        }

        const io = self.DIRECT_VALUES.includes(out) ? self.DIRECT_VALUES.indexOf(out) : _mi(ok, ov)
        const ai = md.split(``).reduce((acc, char) => acc + self.chars.indexOf(char), 0)

        return `${_cp}${self.hashids.encode(io, ai)}`

    }

    lexer(line: string){
        
        const self = this
        let word = ``
        let levels : string[] = []
        let isLevel = false
        let classes : dynamicObject = {}
        let bracketCount = 0

        const processWord = () => {

            word = word.trim()
            if ( !word.includes(`[`)) word = word.replace(/\s+/g, ``)

            if ( word == ``) return 

            if ( word[word.length-1] == `:` ){
                word = word.slice(0, -1)
            }

            const _kw = word in self.propCounter ? ++self.propCounter[word] : self.propCounter[word] = 1

            if ( isLevel ){
                levels.push(`${word}${self.seperator}${_kw}`)
                isLevel = false
            }
            else{
                let _keyWord = `${word}${_kw}`.trim()
                if ( word.includes(`:`) ){
                    const [ key, value ] = word.split(`:`)
                    const _kk = key in self.propCounter ? ++self.propCounter[key] : self.propCounter[key] = 1
                    _keyWord = `${key}${_kk}${value}`.trim()
                }

                classes = setDeep( classes, `${levels.join(`^`)}${levels.length > 0 ? `^` : ``}${word}`, word, `^` )

            }
            word = ``
        }

        line
            .replace(/\`|\}|\{/g, ``)
            .trim()
            .replace(/\s+/g, ` `)
            .split(``)
            .map((char, i, arr) => {
            
                const nextChar = arr[i + 1]   

                if ( char == ` ` && word != `` && ![`(`, `)`, `[`, `]`, `:`].includes(nextChar) && bracketCount == 0) {
                    processWord()
                }
                else{ 
                    
                    if ( [`&`].includes(char)  ){
                        isLevel = true
                    }

                    else if([`(`].includes(char) && isLevel ){
                        processWord()
                    }
                    
                    else if ( [`)`].includes(char) ){
                        processWord()
                        levels.splice(-1, 1)
                        isLevel = false
                    }
                    else {
                        word += char
                        if ( char == `[` ) bracketCount++
                        if ( char == `]` ) bracketCount--
                    }
                }
            })

        if ( word != `` ) processWord()

        return classes
    }

    processLine(line: string){
        const self = this
        // console.log(self.cx)
        if ( line.startsWith(FIELNAME_KEY) ){
            self.cache = { ...self.cache, [FIELNAME_KEY] : line.split(`:`)[1]  }
        }
        else{

            const value = (_k: string, pseudo = ``) => {

                let _mediaQuery = null
                
                if ( _k.includes(`@`) ){
                    const [ _x, _y ] = _k.split(`@`)
                    _k = _x
                    _mediaQuery = _y
                    if( _y.includes(`:`)){
                        const [ _a, _b ] = _y.split(`:`)
                        _k = `${_x}:${_b}`
                        _mediaQuery = _a
                    }
                }

                if ( _k.includes(`:`) ){

                    const [ key, _val ] = _k.split(`:`)

                    if(key in self.PROPS){
                        const _out = self.makeValue(key, _val)
                        const _id = self.makeID(key, _val + pseudo, _out)

                        // console.log(`_VALUE`, _k, _out)

                        if ( pseudo == `` )
                            self.cx.push(_id)

                        // console.log(`_build`, key, _val, _id, _out)

                        if ( _mediaQuery ){
                            self.mediaQueries[_mediaQuery].push({ [_id] : _out } )
                            return {}
                        }

                        if ( pseudo.startsWith(`dark`) ){
                            self._darkQueries[_id] = _out
                            self.cx.push(_id)
                            return {}
                        }

                        return { [_id] : _out } 
                    }
                    else if( key in self.DIRECT ){
                        const hasImportant = _val.endsWith(`!`)
                        const important = hasImportant ? ` !important` : ``

                        let val = hasImportant ? _val.slice(0, -1) : _val
                        var _out : string = ``

                        // if ( key == `ratio` ){
                        //     console.log(`RatioFound`, key, val)
                        // }

                        if ( key == `extend` ){
                            val = val.split(`,`).reduce((acc: string[], v: string) => {
                                acc.push(`${v.startsWith(`.`) ? `` : `.`}${v.trim()}`)
                                return acc }, []).join(`,`)
                        }
                        
                        else if ( key == `ratio` ){
                            _out = self.DIRECT[key].replace(`__VALUE__`, val.replace(`,`, `/`))
                            _out = _out.replace(`;`, `${important};`)
                        }

                        else if ( key == `anim` ){

                            let delay = `0s`
                            let curve = `linear`
                            let duration = val

                            if ( val.includes(",") ) {
                                _out = self.DIRECT[key]
                                const [ _duration, ..._rest ] = val.split(`,`)
                                let rest = _rest.join(",").trim()
                                duration = _duration

                                // if ( rest.includes(`],`) ){

                                // }

                                if( rest.includes(`[`) && rest.includes(`]`) ){
                                        for ( const curv in cssAnimationCurves ){
                                            if ( rest.startsWith(curv) ){
                                                curve = `${rest.replace(curv, cssAnimationCurves[curv]).replace(`[`, `(`).replace(`]`, `)`)}`
                                                break;
                                            }
                                        }
                                }

                                

                            }
                            _out = self.DIRECT[key]
                                .replace(`__VALUE__`, duration)
                                .replace(`__CURVE__`, curve)
                                .replace(`__DELAY__`, delay)
                            
                            _out = _out.replace(`;`, `${important};`)
                        }

                        else if ( key == `rotate3d` ){
                            const [ rx, ry, rz, ra ] = val.split(`,`)
                            _out = self.DIRECT[key]
                                .replace(`__X__`, rx)
                                .replace(`__Y__`, ry)
                                .replace(`__Z__`, rz)
                                .replace(`__A__`, ra.match(/^\d+deg$/) ? ra : `${ra}deg`)
                            _out = _out.replace(`;`, `${important};`)
                        }

                        else{
                            // const __value = `${val}${key == `extend` ? `` : self.makeUnit(key, val)}`
                            const __value = `${val}${self.IGNORE.includes(key) ? `` : self.makeUnit(key, val)}`
                            _out = self.DIRECT[key].includes(`__VALUE__`) ? 
                            self.DIRECT[key].replace(/__VALUE__/g, __value).replace(`;`, `${important};`) : self.DIRECT[key]
                        }

                        // console.log(`_build`, key, _val)
                        
                        const _id = self.makeID(key, key + pseudo, _out)

                        // console.log(`_VALUE-2`, _k, _id)

                        if ( pseudo == `` )
                            self.cx.push(_id)

                        if ( _mediaQuery ){
                            self.mediaQueries[_mediaQuery].push({ [_id] : _out } )
                            return {}
                        }

                        if ( pseudo.startsWith(`dark`) ){
                            self._darkQueries[_id] = _out
                            self.cx.push(_id)
                            return {}
                        }

                        return { [_id] : _out } 
                    }

                }
                else if( _k in self.DIRECT ){
                    const _out = self.DIRECT[_k]
                    const _id = self.makeID(_k, _k + pseudo, _out)
                    // console.log(_k, _id)
                    if ( pseudo == `` )
                        self.cx.push(_id)

                    if ( _mediaQuery ){
                        self.mediaQueries[_mediaQuery].push({ [_id] : _out } )
                        return {}
                    }

                    if ( pseudo.startsWith(`dark`) ){
                        self._darkQueries[_id] = _out
                        self.cx.push(_id)
                        return {}
                    }

                    return { [_id] : _out } 
                }            
                else if ( _k.trim().match(/^[a-zA-Z0-9\-]+$/g)){
                    self.cx.push(_k.trim())
                    // self.cx.push(`--${_k.trim()}`)
                }

                return {}
            }
            
            const build = ( o : dynamicObject, pseudo = `` ) => {
                
                let out : dynamicObject = {}

                Object.keys(o).map((_k : string) => {

                    if ( `object` == typeof o[_k] ){
                        out = { ...out, [_k] : build(o[_k], _k) } 
                    }
                    else{
                        out = { ...out, ...value(o[_k], pseudo) }
                    }
                
                })

                return out 
            }

            const mergeDuplicates = ( o: dynamicObject ) : dynamicObject => {
                
                const kvs : dynamicObject = {}
                const _transforms : string[] = []
                Object.keys(o).map((_k : string) => {
                    if ( typeof o[_k] === `string` && o[_k].startsWith(`transform:`) ){
                        // console.log(_k, o[_k])
                        const [ _tk, _tv ] = o[_k].replace(`;`, ``).split(`:`)
                        _transforms.push(_tv.trim())
                        self.cx.splice(self.cx.indexOf(_k), 1)
                    }
                    else{
                        kvs[_k] = o[_k]
                    }
                })
                if ( _transforms.length > 0 ){
                    const _id = self.makeID(`transform`, `transform`, `transform: ${_transforms.join(` `)}`)
                    kvs[_id] = `transform: ${_transforms.join(` `)};`
                    self.cx.push(_id)
                }
                // console.log(`[mergeDuplicates]`, o, kvs)
                return kvs
            }

            const _built = build(self.lexer(line))

            if ( self.debug?.lexer )
                console.log(pc.cyan(`[lexer]`), line, self.lexer(line), _built)

            // console.log(line, self.lexer(line), _built)
            
            
            // self.cache = { ...self.cache, ...mergeDuplicates(_built) }
            self.cache = { ...self.cache, ...mergeDuplicates(_built) }

        }

    }

    Build( css : string | string[][], cli = false, ff: string = `` ) : {
        cx: string[],
        sheet: string,
        mediaQuery: dynamicObject,
        darkQueries: dynamicObject
    }{
        
        let self = this
        self._cli = cli
        self.cx = []
        self.cache = {}
        self._darkQueries = {}
        self._mediaQueries = {}
        self._currentFile = ff

        if ( undefined == css ) return {
            cx: self.cx,
            sheet: ``,
            mediaQuery: {},
            darkQueries: []
        }

        if ( `string` == typeof css ){
            css = [[css]]
        }

        css.map((arr: string[]) => {
            arr.map((line: string) => {
                self.processLine(line)
            })
        })

        // console.log(self.deepClean(self.cache))

        // const _ = cli ? {
        //     cx: [],
        //     sheet: self.styleSheet(self.deepClean(self.cache))
        // } : {
        //     cx: self.cx,
        //     sheet: ``
        // }

        const _cleaned = self.deepClean(self.cache)
        const _stylesheet = self.styleSheet(_cleaned)
        
        // console.log(_cleaned, _stylesheet)
        // const _mediaQueries : dynamicObject = {}

        
        
        // if ( !cli ){
        //     console.log(css, self.cx, self.styleSheet(_cleaned))
        // }
        // console.log(`[${cli}]`, self.cache)
        // console.log(`[${cli}]`, _cleaned)

        if ( self.debug?.classes )
            console.log(pc.cyan(`[classes]`), self.cx)
        if ( self.debug?.cache )
            console.log(pc.cyan(`[cache]`), self.cache)
        if ( self.debug?.cleaned )
            console.log(pc.cyan(`[cleaned]`), _cleaned)
        if ( self.debug?.sheet )
            console.log(pc.cyan(`[sheet]`), _stylesheet)
        if ( self.debug?.media )
            console.log(pc.cyan(`[mediaquery]`), self._mediaQueries)
        if ( self.debug?.dark )
            console.log(pc.cyan(`[darkquery]`), self._darkQueries)
        
        const _ = {
            cx: self.cx,
            sheet: _stylesheet,
            mediaQuery: self._mediaQueries,
            darkQueries: self._darkQueries
        }

        // console.log(css, _)

        return _

    }

}

export default CSS

export const buildWithStyles = (source: dynamicObject) : dynamicObject => {
    
    const _ : dynamicObject = {}
    const _css = new CSS()

    if ( Object.keys(source).length > 0 ){

        const _transform : string[] = [];
        const _filter : string[] = [];

        for ( const _prop in source ){
            let prop = _prop as cssShortKey
            if ( prop in cssWithKeys ){
                if ( cssTransformKeys.includes(cssWithKeys[prop].toString()) ){
                    _transform.push(`${cssWithKeys[prop]}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                if ( cssFilterKeys.includes(cssWithKeys[prop].toString()) ){
                    _filter.push(`${cssWithKeys[prop]}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                else 
                    _[cssWithKeys[prop]] = source[prop]
            }
            else {
                if ( cssTransformKeys.includes(prop) ){
                    _transform.push(`${prop}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                else if ( cssFilterKeys.includes(prop) ){
                    _filter.push(`${prop}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                else 
                    _[prop] = source[prop]
            }   
        }

        if ( _transform.length > 0 ){
            _.transform = _transform.join(` `)
        }
        if ( _filter.length > 0 ){
            _.filter = _filter.join(` `)
        }

        // console.log(_, _transform)

    }  

    return _
    
}

export const getAnimationCurve = ( curve?: string | TRANSITION_CURVES ): string => {

    if ( !curve ) return `linear`

    switch(curve.toUpperCase()){
        case TRANSITION_CURVES.Bounce:
            return `var(--bounce)`
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

export const animationTransition = (transition: TRANSITIONS, offset = 0, dialog = false) => {
    let _from = {}
    let _to = {}
    switch(transition){
        case TRANSITIONS.SlideInLeft:
        case TRANSITIONS.SlideInRight:
            _from = { x: transition == TRANSITIONS.SlideInLeft ? 
                    dialog ? `-${50 + (offset || 10)}%` : -20 : 
                    dialog ? `-${50 - (offset || 10)}%` : 20, 
                    y: dialog ? `-50%` : 0,
                    opacity: 0 }
            _to = { x: dialog ? `-50%` : 0, y: dialog ? `-50%` : 0, opacity: 1 }
            break;
        case TRANSITIONS.SlideInTop:
        case TRANSITIONS.SlideInBottom:
            _from = { 
                y: transition == TRANSITIONS.SlideInTop ? 
                    //Top
                    dialog ? `-${50 + (offset || 10)}%` : -20 
                    //Bottom 
                    : dialog ? `-${50 - (offset || 10)}%` : 20, 
                x: dialog ? `-50%` : 0,
                    opacity: 0 }
            _to = { y: dialog ? `-50%` : 0, x: dialog ? `-50%` : 0, opacity: 1 }
            break;            
        case TRANSITIONS.ScaleIn:
            _from = { scale: 0, opacity: 0 }
            _to = { scale: 1, opacity: 1 }
            break;            
        case TRANSITIONS.FadeIn:
            _from = { opacity: 0 }
            _to = { opacity: 1 }
            break;            
    }
    return { from: _from, to: _to }
}

export const getAnimationTransition = ( transition: TRANSITIONS, to?: boolean, from?: boolean ) : dynamicObject => {
    
    const { from : _from, to : _to } = animationTransition(transition)

    return to ? { ..._from, ..._to } : from  ? _from : _to

}