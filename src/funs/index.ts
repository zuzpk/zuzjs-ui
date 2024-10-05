import { cssProps } from "./stylesheet.js";
import CSS from './css.js'
import { dynamicObject } from "../types/index.js";
import axios from "axios";
import { colorNames } from "./colors.js";
import Hashids from "hashids";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
import moment from "moment";
import { FormatNumberParams } from "../types/interfaces.js";

let __css : CSS;
export const __SALT : string = `zuzjs-ui`

export const FIELNAME_KEY = `__FILENAME__`
export const LINE_KEY = `__LINE__`

export const toHash = (n: number, len = 6) : string => new Hashids(__SALT, len).encode(n)

export const fromHash = (n: string) : number => Number(new Hashids(__SALT).decode(n))

export const css = () : CSS => __css ? __css : __css = new CSS()

export const uuid = (len?: number) => nanoid(len)

export const numberInRange = (min : number, max : number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  
// Hex color regex (#RGB, #RRGGBB)
export const hexColorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
// export const hexColorRegex3 = /^#([A-Fa-f0-9]{3}){1,2}$/;

// RGBA color regex (rgba(255, 255, 255, 1))
export const rgbaColorRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0|1|0?\.\d+)\s*))?\)$/;

// HSL color regex (hsl(360, 100%, 100%))
export const hslColorRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;

export const isHexColor = (color : string) : boolean =>  hexColorRegex.test(color)

export const isRgbaColor = (color : string) : boolean => rgbaColorRegex.test(color)

export const isHslColor = (color : string) : boolean => hslColorRegex.test(color)

// Function to validate a color string
export const isColor = (color: string) : boolean  => colorNames.includes(color) || isHexColor(color) || isRgbaColor(color) || isHslColor(color)

export const isUrl = (u : string) => {
    let url;
    try{
        url = new URL(u);
    }catch(_){
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:'
}

export const isEmail = (e : string) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e)
	
export const isIPv4 = (ipaddress : string) => {  
	return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);
}

export const isNumber = ( v: any ) => /\d+(\.\d+)?$/g.test(v)

// Convert hex to rgba
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

export const ucfirst = (str : string) => `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`

export const cleanProps = <T extends dynamicObject>( props: T, withProps: string[] = [] ) : T => {

    let _extras = [ `as`, ...withProps ]
    let _props = { ...props }
    
    Object.keys(_props).map(k => {
        if(k in cssProps){
            delete _props[k]
        }
    });
    
    _extras.map(x => x in _props && delete _props[x])

    return _props

}

// export const withZuz = (cx : string | string[]) : string => {
//     console.log(cx)
//     return ``
// }
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

export const extendGlobals = () => {
    Object.prototype.is = function(v : any){ return typeof this === v }
    Object.prototype.typeof = function(v : any){ return typeof this === typeof v }
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