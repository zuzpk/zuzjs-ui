import { __SALT, FIELNAME_KEY, isColor, isHexColor, isNumber, LINE_KEY, setDeep } from "./index.js"
import { dynamicObject } from "../types"
import { cssAnimationCurves, cssDirect, cssProps, cssTransformKeys, cssWithKeys } from "./stylesheet.js"
import Hashids from "hashids"

class CSS {

    cx: string[]
    cache: dynamicObject
    PROPS: dynamicObject
    DIRECT: dynamicObject
    hashids: Hashids
    chars: string
    rgbaRegex: RegExp
    IGNORE: string[]
    unit: any
    keysWithoutCommaToSpace: string[]
    propCounter: dynamicObject
    seperator: string
    pseudoList: string[]
    ids: string[]

    constructor(options?: dynamicObject | undefined){

        const opts = options || {}

        this.cx = []
        this.cache = {}
        
        this.unit = opts.unit || `px`

        this.seperator = `__@@__`
        this.hashids = new Hashids(__SALT, 5)
        this.chars = "#@_-[]{}();:^/!^&*+='\"`,.~abcdefghijklmnopqrstuvwxyz0123456789"
        this.rgbaRegex = /\b\w+\[\d+,\d+,\d+(?:,\d+)?\]/g;
        this.pseudoList  = [
            "@before", "@after", "@active", "@checked", "@default", "@disabled", "@empty", "@enabled", "@first", "@firstChild", "@firstOfType", "@focus", "@hover", "@indeterminate", "@inRange", "@invalid", "@lastChild", "@lastOfType", "@link", "@not", "@nthChild", "@nthLastChild", "@nthLastOfType", "@nthOfType", "@onlyChild", "@onlyOfType", "@optional", "@outOfRange", "@readOnly", "@readWrite", "@required", "@root", "@scope", "@target", "@valid", "@visited"
        ]
        
        this.IGNORE = [
            `flex`, `opacity`, `z-index`, `zIndex`, `color`, `line-height`, `anim`, `scale`
        ]
        this.keysWithoutCommaToSpace = [
            `transform`, `translate`, `color`, `background`, `background-color`, `backgroundColor`,
            `border`, `border-bottom`, `border-top`, `border-left`, `border-right`,
            `grid-template-rows`, `grid-template-columns`
        ]
        
        this.propCounter = {}
        this.ids = []

        this.PROPS = cssProps
        this.DIRECT = cssDirect
        
    }

    styleSheet(cache: dynamicObject, pseudo = ``) : string {
        const self = this    
        const scss : string[] = []

        // console.log(cache)

        const build = ( key : string, value: dynamicObject | string ) : string => {
            
            let css = `${self.pseudoList.includes(`@${key}`) ? `&:` : `.`}${key}{`
            if ( `object` == typeof value ){

                for ( const prop in value ){

                    if ( `object` == typeof value[prop] ){
                        css += build(prop, value[prop])
                    }
                    else{
                        css += value[prop]
                    }

                }

            }
            else {
                css += value
            }

            css += `}`
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

        return scss.join(`\n`)
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
                `object` == typeof cache[_k] ){

                const _d = oid(_k, cache[_k])
                let _indices = 0
                for(let i = 0; i < _d.length; i++){ 
                    _indices += self.chars.indexOf(_d.charAt(i))
                } 

                const _id = `z${self.hashids.encode(_indices)}`

                if ( !_[_id] ){

                    const cleaned = self.deepClean(cache[_k], level + 1)
                    if ( level == 0 && self.pseudoList.includes(`@${__k}`) ){
                        self.cx.push(_id)
                        _[_id] = { [__k] :  cleaned }    
                    }
                    else 
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
        if( k == `rotate` ){
            return `deg`
        }
        if ( cssTransformKeys.includes(k) ) return ``
        if( typeof v == "string" && (!isNumber(v) || this.IGNORE.indexOf(k) > -1) )
            return ``
        return this.unit;
    }

    makeValue(k: string, v: any){

        if(k in this.PROPS){
            const key = this.PROPS[k]
            let value;

            v = v.trim()

            let hasImportant = v.charAt(v.length-1) == `!`
            v = hasImportant ? v.slice(0, -1) : v
            let important = hasImportant ? ` !important` : ``

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

            // if ( key == `scale` ){
            //     console.log(key, value, important)
            // }
            // if ( key == `extend` ){
            //     value = value.split(`,`).reduce((acc: string[], v: string) => acc.push(`${v.startsWith(`.`) ? `` : `.`}${v}`) && acc, []).join(`,`)
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

    mmakeID(k: string, v: string, _out: string) : string {
        const cs : string[] = []
        // const out = this.hashids.encode(this.calcIndexes(k) + this.calcIndexes(v) + this.calcIndexes(_out))
        const out = this.calcIndexes(k) + this.calcIndexes(v) + this.calcIndexes(_out)
        console.log(this.hashids.encode(out))
        cs.push(
             out.charAt(0).match(/\d+/g) ? `z` : ``,
             out   
        )

        return cs.join(``)
    }

    makeID(k: string, v: string, _out: string){
        // console.log(`makeID`, k, v, _out)
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
        const _id = `${_cp}${self.hashids.encode((self.PROPS[k] ? self.PROPS[k].length : 0)+ _indices + (isNaN(parseInt(v)) ? 0 : parseInt(v)))}`.replace(/\s|\$/g, '-')       
        const _kw = _id in self.propCounter ? ++self.propCounter[_id] : self.propCounter[_id] = 1
        // return `${_id}-${_kw}`
        return _id
    // }
    }

    lexer(line: string){
        
        const self = this
        let word = ``
        let levels : string[] = []
        let isLevel = false
        let classes : dynamicObject = {}
        let hasBracket = false

        const processWord = () => {

            word = word.trim()
            if ( !word.includes(`[`)) word = word.replace(/\s+/g, ``)

            if ( word == ``) return 

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

                if ( char == ` ` && word != `` && ![`(`, `)`, `[`, `]`, `:`].includes(nextChar) && !hasBracket) {
                    processWord()
                }
                else{ 
                    
                    //SKIPABLE
                    // if([`(`].includes(char) && level == 0 ){
                    //     //DON'T ADD
                    // }

                    if ( 
                        [`&`].includes(char) 
                    ){
                        isLevel = true
                    }

                    //Level Start
                    else if([`(`].includes(char) && isLevel ){
                        processWord()
                    }
                    //Level End
                    else if ( [`)`].includes(char) ){
                        processWord()
                        // console.log(`before->`, levels)
                        levels.splice(-1, 1)
                        // console.log(`after->`, levels)
                        isLevel = false
                    }
                    else {
                        word += char
                        if ( char == `[` ) hasBracket = true
                        if ( char == `]` && hasBracket ) hasBracket = false                        
                    }
                }
            })

        if ( word != `` ) processWord()

        return classes
    }

    processLine(line: string){
        const self = this

        if ( line.startsWith(FIELNAME_KEY) ){
            self.cache = { ...self.cache, [FIELNAME_KEY] : line.split(`:`)[1]  }
        }
        else{

            const value = (_k: string, pseudo = ``) => {

                if ( _k.includes(`:`) ){

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
                        const important = hasImportant ? ` !important` : ``

                        let val = hasImportant ? _val.slice(0, -1) : _val
                        var _out : string = ``

                        if ( key == `extend` ){
                            val = val.split(`,`).reduce((acc: string[], v: string) => {
                                acc.push(`${v.startsWith(`.`) ? `` : `.`}${v.trim()}`)
                                return acc }, []).join(`,`)
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
                        }

                        else{
                            const __value = `${val}${key == `extend` ? `` : self.makeUnit(key, val)}`
                            _out = self.DIRECT[key].includes(`__VALUE__`) ? 
                            self.DIRECT[key].replace(/__VALUE__/g, __value).replace(`;`, `${important};`) : self.DIRECT[key]
                        }

                        const _id = self.makeID(key, key + pseudo, _out)
                        if ( pseudo == `` )
                            self.cx.push(_id)
                        return { [_id] : _out } 
                    }

                }
                else if( _k in self.DIRECT ){
                    const _out = self.DIRECT[_k]
                    const _id = self.makeID(_k, _k + pseudo, _out)
                    if ( pseudo == `` )
                        self.cx.push(_id)
                    return { [_id] : _out } 
                }            
                else if (_k.trim().match(/^[a-zA-Z0-9\-]+$/g)){
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

            const _built = build(self.lexer(line))

            // console.log(self.lexer(line))

            self.cache = { ...self.cache, ..._built }

        }

    }

    Build( css : string | string[][], cli = false ) : {
        cx: string[],
        sheet: string
    }{
        
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

        css.map((arr: string[]) => {
            arr.map((line: string) => {
                self.processLine(line)
            })
        })

        // console.log(self.cache)
        // console.log(self.deepClean(self.cache))

        // const _ = cli ? {
        //     cx: [],
        //     sheet: self.styleSheet(self.deepClean(self.cache))
        // } : {
        //     cx: self.cx,
        //     sheet: ``
        // }

        const _cleaned = self.deepClean(self.cache)

        // if ( !cli ){
        //     console.log(css, self.cx, self.styleSheet(_cleaned))
        // }

        const _ = {
            cx: self.cx,
            sheet: self.styleSheet(_cleaned)
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

        for ( const prop in source ){
            if ( prop in cssWithKeys ){
                if ( cssTransformKeys.includes(cssWithKeys[prop]) ){
                    _transform.push(`${cssWithKeys[prop]}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                else 
                    _[cssWithKeys[prop]] = source[prop]
            }
            else {
                if ( cssTransformKeys.includes(prop) ){
                    _transform.push(`${prop}(${source[prop]}${_css.makeUnit(prop, source[prop])})`)
                }
                else 
                    _[prop] = source[prop]
            }   
        }

        if ( _transform.length > 0 ){
            _.transform = _transform.join(` `)
        }

        // console.log(_, _transform)

    }  

    return _
    
}

export const getAnimationCurve = ( curve?: string ): string => {

    if ( !curve ) return `linear`

    const _curves = [`spring`]

    if ( _curves.includes(curve) ){
        switch(curve){
            case "spring":
                return `cubic-bezier(0.2, -0.36, 0, 1.46)`
                break;
            default:
                return `linear`
        }
    }

    return curve
}