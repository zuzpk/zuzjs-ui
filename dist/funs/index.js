import { cssProps } from "./stylesheet.js";
import CSS from './css.js';
import axios from "axios";
import { colorNames } from "./colors.js";
import Hashids from "hashids";
import { nanoid } from "nanoid";
import Cookies from "js-cookie";
import moment from "moment";
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
    let _extras = [`as`, ...withProps];
    let _props = { ...props };
    Object.keys(_props).map(k => {
        if (k in cssProps) {
            delete _props[k];
        }
    });
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
export const useDevice = () => {
    const userAgent = navigator.userAgent;
    const mobile = /Mobi|Android/i.test(userAgent);
    const tablet = /Tablet|iPad/i.test(userAgent);
    return {
        isMobile: mobile,
        isTablet: tablet,
        isDesktop: !mobile && !tablet
    };
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
