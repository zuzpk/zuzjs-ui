import { cssProps } from "./stylesheet.js";
import CSS from './css.js';
import axios from "axios";
import { colorNames } from "./colors.js";
import Hashids from "hashids";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
import moment from "moment";
import { SORT } from "../types/enums.js";
let __css;
export const __SALT = `zuzjs-ui`;
export const FIELNAME_KEY = `__FILENAME__`;
export const LINE_KEY = `__LINE__`;
export const toHash = (n, len = 6) => new Hashids(__SALT, len).encode(n);
export const fromHash = (n) => Number(new Hashids(__SALT).decode(n));
export const css = () => __css ? __css : __css = new CSS();
export const uuid = (len) => nanoid(len);
export const numberInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
export const toLowerCase = String.prototype.toLocaleLowerCase || String.prototype.toLowerCase;
export const hexColorRegex = /^#([A-Fa-f0-9]{3}){1,2}$/;
export const rgbaColorRegex = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(,\s*((0|1|0?\.\d+)\s*))?\)$/;
export const hslColorRegex = /^hsl\(\s*(\d{1,3})\s*,\s*(\d{1,3})%\s*,\s*(\d{1,3})%\s*\)$/;
export const isHexColor = (color) => hexColorRegex.test(color);
export const isRgbaColor = (color) => rgbaColorRegex.test(color);
export const isHslColor = (color) => hslColorRegex.test(color);
export const isColor = (color) => colorNames.includes(color) || isHexColor(color) || isRgbaColor(color) || isHslColor(color);
export const isUrl = (u) => {
    let url;
    try {
        url = new URL(u);
    }
    catch (_) {
        return false;
    }
    return url.protocol === 'http:' || url.protocol === 'https:';
};
export const isEmail = (e) => /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(e);
export const isIPv4 = (ipaddress) => {
    return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ipaddress);
};
export const isNumber = (v) => /\d+(\.\d+)?$/g.test(v);
export const hexToRgba = (hex, alpha = 1) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
export const ucfirst = (str) => `${str.charAt(0).toUpperCase()}${str.substring(1, str.length)}`;
export const cleanProps = (props, withProps = []) => {
    let _extras = [`as`, `editor`, ...withProps];
    let _props = { ...props };
    Object.keys(_props).map(k => {
        if (k in cssProps) {
            delete _props[k];
        }
    });
    if (`skeleton` in _extras && _extras.skeleton.enabled == true) {
        delete _props[`children`];
    }
    _extras.map(x => x in _props && delete _props[x]);
    return _props;
};
export const withZuz = (cx) => css().Build([[`string` == typeof cx ? cx : cx.join(` `)]]).cx.join(` `);
export const setDeep = (object, path, value, seperator = `.`) => {
    const _path = path.split(seperator);
    const base = _path[0];
    if (base === undefined) {
        return object;
    }
    if (!object.hasOwnProperty(base)) {
        object[base] = {};
    }
    value = _path.length <= 1 ? value : setDeep(object[base], _path.slice(1).join(seperator), value, seperator);
    return {
        ...object,
        [base]: value,
    };
};
export const removeDuplicatesFromArray = (array) => {
    return array.reduce((accumulator, currentValue) => {
        if (!accumulator.includes(currentValue)) {
            accumulator.push(currentValue);
        }
        return accumulator;
    }, []);
};
export const extendGlobals = () => {
    Object.prototype.is = function (v) { return typeof this === v; };
    Object.prototype.typeof = function (v) { return typeof this === typeof v; };
    Object.prototype.equals = function (v) { return this === v; };
    Object.prototype.isNull = function () { return this === null; };
    Object.prototype.isString = function () { return typeof this == `string`; };
    Object.prototype.isNumber = function () { return /^[+-]?\d+(\.\d+)?$/.test(this); };
    Object.prototype.isObject = function () { return typeof this == `object` && !Array.isArray(this) && this !== null; };
    Object.prototype.isArray = function () { return Array.isArray(this); };
    Object.prototype.isEmpty = function () {
        if (Array.isArray(this))
            return this.length === 0;
        else if (`object` === typeof this)
            return Object.keys(this).length == 0;
        else
            return this == "" || this.length == 0;
    };
};
export const withPost = async (uri, data, timeout = 60, fd = {}) => {
    if (Object.keys(fd).length > 0) {
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
                if (resp.data && "kind" in resp.data) {
                    resolve(resp.data);
                }
                else {
                    reject(resp.data);
                }
            })
                .catch(err => reject(err));
        });
    }
    return new Promise((resolve, reject) => {
        axios.post(uri, {
            ...data,
            ...Cookies.get(),
            __stmp: new Date().getTime() / 1000
        }, {
            timeout: 1000 * timeout,
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(resp => {
            if (resp.data && "kind" in resp.data) {
                resolve(resp.data);
            }
            else {
                reject(resp.data);
            }
        })
            .catch(err => reject(err));
    });
};
export const withTime = (fun) => {
    const start = new Date().getTime();
    const result = fun();
    const end = new Date().getTime();
    return {
        result,
        executionTime: end - start
    };
};
export const time = (stamp, format) => {
    return stamp ?
        moment.unix(+stamp / 1000).format(format || `YYYY-MM-DD HH:mm:ss`)
        : moment().format(format || `YYYY-MM-DD HH:mm:ss`);
};
export const arrayRand = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const formatNumber = ({ number, locale = 'en-US', style = `decimal`, decimal = 2, currency }) => {
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
};
export const formatSize = (bytes) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const _bytes = `string` == typeof bytes ? parseFloat(bytes) : bytes;
    if (_bytes == 0)
        return '0 Byte';
    const _i = Math.floor(Math.log(_bytes) / Math.log(1024));
    const i = `string` == typeof _i ? parseInt(_i) : _i;
    const nx = _bytes / Math.pow(1024, i);
    return nx.toFixed(2) + ' ' + sizes[i];
};
export const copyToClipboard = (text) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text);
    }
    else {
        return new Promise((resolve, reject) => {
            const textarea = document.createElement("textarea");
            textarea.value = text;
            textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand("copy");
                resolve(`Copied to clipboard`);
            }
            catch (err) {
                reject(err);
            }
            document.body.removeChild(textarea);
        });
    }
};
export const natsort = (options = {
    direction: SORT.Asc,
    caseSensitive: false,
}) => {
    const ore = /^0/;
    const sre = /\s+/g;
    const tre = /^\s+|\s+$/g;
    const ure = /[^\x00-\x80]/;
    const hre = /^0x[0-9a-f]+$/i;
    const nre = /(0x[\da-fA-F]+|(^[\+\-]?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?(?=\D|\s|$))|\d+)/g;
    const dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
    const GREATER = options.direction == SORT.Desc ? -1 : 1;
    const SMALLER = -GREATER;
    const _normalize = !options.caseSensitive
        ? (s) => toLowerCase.call(`${s}`).replace(tre, '')
        : (s) => (`${s}`).replace(tre, '');
    const _tokenize = (s) => {
        return s.replace(nre, '\0$1\0')
            .replace(/\0$/, '')
            .replace(/^\0/, '')
            .split('\0');
    };
    const _parse = (s, l) => {
        return (!s.match(ore) || l === 1) &&
            parseFloat(s)
            || s.replace(sre, ' ').replace(tre, '')
            || 0;
    };
    return function (a, b) {
        const aa = _normalize(a);
        const bb = _normalize(b);
        if (!aa && !bb) {
            return 0;
        }
        if (!aa && bb) {
            return SMALLER;
        }
        if (aa && !bb) {
            return GREATER;
        }
        const aArr = _tokenize(aa);
        const bArr = _tokenize(bb);
        const aHex = aa.match(hre);
        const bHex = bb.match(hre);
        const av = (aHex && bHex) ? parseInt(aHex[0], 16) : (aArr.length !== 1 && Date.parse(aa));
        const bv = (aHex && bHex)
            ? parseInt(bHex[0], 16)
            : av && bb.match(dre) && Date.parse(bb) || null;
        if (bv) {
            if (av === bv) {
                return 0;
            }
            if (typeof av === 'number' && typeof bv === 'number' && av < bv) {
                return SMALLER;
            }
            if (typeof av === 'number' && av > bv) {
                return GREATER;
            }
        }
        const al = aArr.length;
        const bl = bArr.length;
        for (let i = 0, l = Math.max(al, bl); i < l; i += 1) {
            const af = _parse(aArr[i] || '', al);
            const bf = _parse(bArr[i] || '', bl);
            if (isNaN(af) !== isNaN(bf)) {
                return isNaN(af) ? GREATER : SMALLER;
            }
            if (ure.test(af + bf) && af.localeCompare) {
                const comp = af.localeCompare(bf);
                if (comp > 0) {
                    return GREATER;
                }
                if (comp < 0) {
                    return SMALLER;
                }
                if (i === l - 1) {
                    return 0;
                }
            }
            if (af < bf) {
                return SMALLER;
            }
            if (af > bf) {
                return GREATER;
            }
            if (`${af}` < `${bf}`) {
                return SMALLER;
            }
            if (`${af}` > `${bf}`) {
                return GREATER;
            }
        }
        return 0;
    };
};
