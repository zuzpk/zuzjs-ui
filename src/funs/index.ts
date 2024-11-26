import Hashids from "hashids";
import CSS from "./css.js";
import { nanoid } from "nanoid";
import md5 from "md5";
import { colorNames } from "./colors.js";
import { dynamicObject, FormatNumberParams, sortOptions } from "../types/index.js";
import { cssProps } from "./stylesheet.js";
import axios from "axios";
import Cookies from "js-cookie";
import moment from "moment";
import { KeyCode, SORT } from "../types/enums.js";
import { Skeleton } from "../types/interfaces";
import { Children, cloneElement, isValidElement, ReactElement, ReactNode } from "react";

let __css : CSS;

export const __SALT : string = `zuzjs-ui`
export const FIELNAME_KEY = `__FILENAME__`
export const LINE_KEY = `__LINE__`

export const withGlobals = () => {
    Object.prototype.isTypeof = function(v : any){ return typeof this === typeof v }
    Object.prototype.equals = function(v : any){ return this === v }
    Object.prototype.isNull = function(){ return this === null }
    Object.prototype.isString = function(){ return typeof this == `string` }
    Object.prototype.isNumber = function(){ return /^[+-]?\d+(\.\d+)?$/.test(this as string) }
    Object.prototype.isObject = function(){ return typeof this == `object` && !Array.isArray(this!) && this! !== null }
    Object.prototype.isArray = function(){ return Array.isArray(this!) }
    Object.prototype.isEmpty = function(){
        if(Array.isArray(this))
            return this.length === 0
        else if(`object` === typeof this!)
            return Object.keys(this!).length == 0
        else
            return this! == "" || (this! as string).length == 0
    }
    Object.prototype.isUrl = function(){
        return /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(this as string);
    }
    Object.prototype.toLowerCase = function(){ 
        if ( typeof this === "string" ){
            return (String.prototype.toLocaleLowerCase || String.prototype.toLowerCase)(this);
        }
        return String(this).toLocaleLowerCase()
    }
    // Color validation methods on String prototype
    String.prototype.isHexColor = function() {
        return hexColorRegex.test(this as string);
    };
    String.prototype.isRgbaColor = function() {
        return rgbaColorRegex.test(this as string);
    };
    String.prototype.isHslColor = function() {
        return hslColorRegex.test(this as string);
    };
    String.prototype.isColor = function() {
        return colorNames.includes(this as string) || this.isHexColor() || this.isRgbaColor() || this.isHslColor();
    };
    String.prototype.ucfirst = function(){
        return `${this.charAt(0).toUpperCase()}${this.substring(1, this.length)}`
    }
}

export const isBrowser = typeof document !== "undefined"

export const is = (o: any, v : any) => typeof o === v;

export const isTypeOf = (o: any, v : any) => typeof o === typeof v;

export const equals = (o: any, v : any) => o === v;

export const isNull = (o: any) => o === null;

export const isString = (o: any) => typeof o == `string`;

export const isNumber = (o: string) => /^[+-]?\d+(\.\d+)?$/.test(o);

export const isObject = (o: any) => typeof o == `object` && !Array.isArray(o) && o !== null;
    
export const isArray = (o: any) => Array.isArray(o)

export const isEmpty = (o: any) => {
    if(Array.isArray(o))
        return o.length === 0
    else if(`object` === typeof o)
        return Object.keys(o).length == 0
    else
        return o == "" || (o as string).length == 0
}
    
export const isEmail = (e : string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)

export const isUrl = (o: string) => /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/.test(o);
    
export const toLowerCase = (o: string) => (String.prototype.toLocaleLowerCase || String.prototype.toLowerCase)(o);

export const ucfirst = (o: any) => `${o.charAt(0).toUpperCase()}${o.substring(1, o.length)}`
    
export const toHash = (n: number, len = 6) : string => new Hashids(__SALT, len).encode(n)

export const fromHash = (n: string) : number => Number(new Hashids(__SALT).decode(n))

export const css = () : CSS => __css ? __css : __css = new CSS()

export const withCSS = (cx : string | string[]) : string => css().Build([ [ `string` == typeof cx ? cx : cx.join(` `) ] ]).cx.join(` `)

export const uuid = (len?: number) => nanoid(len)

export const MD5 = (str: string) => md5(str)

export const numberInRange = (min : number, max : number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getCSSVariable = (el: HTMLElement, name : string) : string => {
    return getComputedStyle(el).getPropertyValue(`--${name}`);
}

// Hex color regex (#RGB, #RRGGBB)
export const hexColorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;

// RGBA color regex (rgba(255, 255, 255, 1))
export const rgbaColorRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0|1|0?\.\d+)\s*))?\)$/;
// HSL color regex (hsl(360, 100%, 100%))
export const hslColorRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

export const isHexColor = (color : string) : boolean =>  hexColorRegex.test(color)

export const isRgbaColor = (color : string) : boolean => rgbaColorRegex.test(color)

export const isHslColor = (color : string) : boolean => hslColorRegex.test(color)

// Function to validate a color string
export const isColor = (color: string) : boolean  => colorNames.includes(color) || isHexColor(color) || isRgbaColor(color) || isHslColor(color)

export const hexToRgba = (hex: string, alpha: number = 1): string => {
    // Remove the hash symbol if present
    hex = hex.replace(/^#/, '');
  
    // If shorthand hex (#RGB), expand it to full form (#RRGGBB)
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
  
    // Convert to integer values for RGB
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
  
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const cleanProps = <T extends dynamicObject>( props: T, withProps: string[] = [] ) : T => {

    let _extras = [ `as`, `editor`, ...withProps ]
    let _props = { ...props }
    
    Object.keys(_props).map(k => {
        if(k in cssProps){
            delete _props[k]
        }
    });

    if ( `skeleton` in _extras && (_extras.skeleton as Skeleton).enabled == true ){
        delete _props[`children`]
    }
    
    _extras.map(x => x in _props && delete _props[x])

    return _props

}

export const withZuz = (cx : string | string[]) : string => css().Build([ [ `string` == typeof cx ? cx : cx.join(` `) ] ]).cx.join(` `)

export const setDeep = (object : dynamicObject, path: string, value : any, seperator = `.`) => {
                
    const _path = path.split(seperator);
    const base = _path[0];
    
    if (base === undefined) {
        return object;
    }

    if (!object.hasOwnProperty(base)) {
        object[base] = {};
    }

    // Determine if there is still layers to traverse
    value = _path.length <= 1 ? value : setDeep(object[base], _path.slice(1).join(seperator), value, seperator);
    
    return {
        ...object,
        [base]: value,
    }
}

export const removeDuplicatesFromArray = <T>(array: T[]): T[] => {
    return array.reduce((accumulator: T[], currentValue: T) => {
        if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
}

export const withPost = async (uri: string, data: dynamicObject, timeout: number = 60, fd: dynamicObject = {} ) => {
    if ( Object.keys(fd).length > 0 ){
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: uri,
                data: {
                    ...data,
                    ...Cookies.get(),
                },
                timeout: timeout * 1000,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                onUploadProgress: ev => {

                }
            })
            .then(resp => {
                if(resp.data && "kind" in resp.data){
                    resolve(resp.data)
                }else{
                    reject(resp.data)
                }            
            })
            .catch(err => reject(err));
        })
    }
    return new Promise((resolve, reject) => {
        axios.post(
            uri,
            {
                ...data,
                ...Cookies.get(),
                __stmp: new Date().getTime() / 1000
            },
            {
                timeout: 1000 * timeout,
                headers: {
                    'Content-Type': 'application/json',
                }
            }            
        )
        .then(resp => {
            if(resp.data && "kind" in resp.data){
                resolve(resp.data)
            }else{
                reject(resp.data)
            }            
        })
        .catch(err => reject(err));
    })
}

export const withTime = ( fun : (...args: any[]) => any ) => {
    const start = new Date().getTime()
    const result = fun()
    const end = new Date().getTime()
    return {
        result,
        executionTime: end - start
    }
}

export const time = (stamp?: number, format?: string) => {
    return stamp ? 
        moment.unix(+stamp / 1000).format(format || `YYYY-MM-DD HH:mm:ss`)
        : moment().format(format || `YYYY-MM-DD HH:mm:ss`)
}

export const timeSince = (stamp: number) => moment(stamp).fromNow()

export const arrayRand = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)]

export const formatNumber = ({
    number,
    locale = 'en-US',
    style = `decimal`,
    decimal = 2,
    currency
} : FormatNumberParams) => {

    if (style === 'currency' && !currency) {
        throw new TypeError('Currency code is required with currency style.');
    }

    if (currency) {
        const { code, style: currencyStyle, symbol } = currency;
        const out = new Intl.NumberFormat(locale, {
            style: `currency`,
            currency: code,
            currencyDisplay: currencyStyle,
            minimumFractionDigits: +number % 1 > 0 ? decimal : 0,
            maximumFractionDigits: +number % 1 > 0 ? decimal : 0
        }).format(+number);
        return symbol ? out.replace(new RegExp(`\\${code}`, 'g'), symbol) : out;
    }

    return new Intl.NumberFormat(locale, {
        style,
        minimumFractionDigits: +number % 1 > 0 ? 2 : 0,
        maximumFractionDigits: +number % 1 > 0 ? 2 : 0
    }).format(+number);
}

export const formatSize = (bytes : number | string) => {
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const _bytes = `string` == typeof bytes ? parseFloat(bytes) : bytes
	if (_bytes == 0) return '0 Byte';
    const _i = Math.floor(Math.log(_bytes) / Math.log(1024))
	const i = `string` == typeof _i ? parseInt(_i) : _i
	const nx = _bytes / Math.pow(1024, i);
	return  nx.toFixed(2) + ' ' + sizes[i];
}

export const copyToClipboard = (text: string) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    } else {
        return new Promise((resolve, reject) => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                resolve(`Copied to clipboard`);
            } catch (err) {
                // console.error("Fallback: Oops, unable to copy", err);
                reject(err);
            }
            document.body.removeChild(textarea);
        })
    }
}

export const natsort = (options: sortOptions = {
    direction: SORT.Asc,
    caseSensitive: false,
}) => {

    const ore = /^0/
    const sre = /\s+/g
    const tre = /^\s+|\s+$/g
    // unicode
    const ure = /[^\x00-\x80]/
    // hex
    const hre = /^0x[0-9a-f]+$/i
    // numeric
    const nre = /(0x[\da-fA-F]+|(^[\+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|\d+)/g
    // datetime
    const dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/ // tslint:disable-line
      
    const GREATER = options.direction == SORT.Desc ? -1 : 1
    const SMALLER = -GREATER
    
    const _normalize = !options.caseSensitive
        ? (s: string | number) => s.toString().toLowerCase().replace(tre, '')
        : (s: string | number) => (`${s}`).replace(tre, '')
      
    const _tokenize = (s: string): string[] => {
        return s.replace(nre, '\0$1\0')
        .replace(/\0$/, '')
        .replace(/^\0/, '')
        .split('\0')
    }
      
    const _parse = (s: string, l: number) => {
        return (!s.match(ore) || l === 1) && 
            parseFloat(s) 
            || s.replace(sre, ' ').replace(tre, '')
            || 0
    }
      
    return function (
        a: string | number,
        b: string | number,
    ): number {
      
        const aa = _normalize(a)
        const bb = _normalize(b)
      
        if (!aa && !bb) {
            return 0
        }
      
        if (!aa && bb) {
            return SMALLER
        }
      
        if (aa && !bb) {
            return GREATER
        }
      
        const aArr = _tokenize(aa)
        const bArr = _tokenize(bb)
      
        // hex or date detection
        const aHex = aa.match(hre)
        const bHex = bb.match(hre)
        const av = (aHex && bHex) ? parseInt(aHex[0], 16) : (aArr.length !== 1 && Date.parse(aa))
        const bv = (aHex && bHex)
            ? parseInt(bHex[0], 16)
            : av && bb.match(dre) && Date.parse(bb) || null
      
        // try and sort Hex codes or Dates
        if (bv) {

            if (av === bv) {
                return 0
            }
      
            if (typeof av === 'number' && typeof bv === 'number' && av < bv) {
              return SMALLER
            }
      
            if (typeof av === 'number' && av > bv) {
              return GREATER
            }

        }
      
        const al = aArr.length
        const bl = bArr.length
      
        // handle numeric strings and default strings
        for (let i = 0, l = Math.max(al, bl); i < l; i += 1) {
      
            const af = _parse(aArr[i] || '', al)
            const bf = _parse(bArr[i] || '', bl)
      
            if (isNaN(af as number) !== isNaN(bf as number)) {
              return isNaN(af as number) ? GREATER : SMALLER
            }
      
            if (ure.test((af as string) + (bf as string)) && (af as string).localeCompare) {
              const comp = (af as string).localeCompare(bf as string)
      
              if (comp > 0) {
                return GREATER
              }
      
              if (comp < 0) {
                return SMALLER
              }
      
              if (i === l - 1) {
                return 0
              }
            }
      
            if (af < bf) {
              return SMALLER
            }
      
            if (af > bf) {
              return GREATER
            }
      
            if (`${af}` < `${bf}`) {
              return SMALLER
            }
      
            if (`${af}` > `${bf}`) {
              return GREATER
            }
        }
      
        return 0
    }
}

export const bindKey = (key: KeyCode, fun: () => void, element?: HTMLElement): void => {

    const handleKeydown = (event: KeyboardEvent) => {
      if (key === event.keyCode) {
        fun();
      }
    };
  
    (element || document.documentElement).addEventListener('keydown', handleKeydown);

}

export const camelCase = (str: string) => {
    return str
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/)    // Split by any non-alphanumeric character
        .map((word, index) =>
            index === 0
                ? word
                : word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join('');
}

export const pluralize = (word: string, count : number) => `${word}${count !== 1 ? 's' : ''}`

export const addPropsToChildren = (children: ReactNode, conditions: (child: ReactElement<any>) => boolean, newProps: object) : ReactNode => {
    return Children.map(children, (child) => {
        if ( isValidElement(child) ){
            const element = child as ReactElement<any>
            const newChild = conditions(element) 
                ? cloneElement(element, { ...newProps })
                : element
            if ( element.props.children ){
                return cloneElement(newChild, {
                    children: addPropsToChildren(element.props.children, conditions, newProps)
                })
            }
            return newChild
        }
        return child
    })
}