import CSS from "./css.js";
import { dynamicObject, FormatNumberParams, sortOptions } from "../types/index.js";
import { AxiosProgressEvent } from "axios";
import { KeyCode } from "../types/enums.js";
import { ReactElement, ReactNode, Ref } from "react";
export declare const __SALT: string;
export declare const FIELNAME_KEY = "__FILENAME__";
export declare const LINE_KEY = "__LINE__";
export declare const withGlobals: () => void;
export declare const isBrowser: boolean;
export declare const is: (o: any, v: any) => boolean;
export declare const isTypeOf: (o: any, v: any) => boolean;
/**
 * Check if 2 objects have the same keys and values, including nested objects.
 * @param obj1
 * @param obj2
 * @returns @boolean
 */
export declare const compare: (obj1: any, obj2: any) => boolean;
export declare const equals: (o: any, v: any) => boolean;
export declare const isNull: (o: any) => boolean;
export declare const isString: (o: any) => o is string;
export declare const isNumber: (o: string) => boolean;
export declare const isObject: (o: any) => boolean;
export declare const isArray: (o: any) => o is any[];
export declare const isEmpty: (o: any) => boolean;
export declare const toHMS: (tm: string | number) => string;
export declare const isEmail: (e: string) => boolean;
export declare const isUrl: (o: string) => boolean;
export declare const toLowerCase: (o: string) => string;
export declare const ucfirst: (o: any) => string;
export declare const toHash: (n: number, len?: number) => string;
export declare const fromHash: (n: string) => number;
export declare const css: () => CSS;
export declare const withCSS: (cx: string | string[]) => string;
export declare const uuid: (len?: number) => string;
export declare const MD5: (str: string) => string;
export declare const numberInRange: (min: number, max: number) => number;
export declare const getCSSVariable: (el: HTMLElement, name: string) => string;
export declare const hexColorRegex: RegExp;
export declare const rgbaColorRegex: RegExp;
export declare const hslColorRegex: RegExp;
export declare const isHexColor: (color: string) => boolean;
export declare const isRgbaColor: (color: string) => boolean;
export declare const isHslColor: (color: string) => boolean;
export declare const isColor: (color: string) => boolean;
export declare const hexToRgba: (hex: string, alpha?: number) => string;
export declare const cleanProps: <T extends dynamicObject>(props: T, withProps?: string[]) => T;
export declare const withZuz: (cx: string | string[]) => string;
export declare const setDeep: (object: dynamicObject, path: string, value: any, seperator?: string) => dynamicObject;
export declare const removeDuplicatesFromArray: <T>(array: T[]) => T[];
export declare const withPost: (uri: string, data: dynamicObject | FormData, timeout?: number, onProgress?: (ev: AxiosProgressEvent) => void) => Promise<dynamicObject>;
export declare const withGet: <T>(uri: string, timeout?: number) => Promise<T>;
export declare const withTime: (fun: (...args: any[]) => any) => {
    result: any;
    executionTime: number;
};
export declare const time: (stamp?: number, format?: string) => string;
export declare const timeSince: (stamp: number) => string;
export declare const arrayRand: (arr: any[]) => any;
export declare const formatNumber: ({ number, locale, style, decimal, currency }: FormatNumberParams) => string;
export declare const formatSize: (bytes: number | string) => string;
export declare const copyToClipboard: (text: string) => Promise<unknown>;
export declare const natsort: (options?: sortOptions) => (a: string | number, b: string | number) => number;
export declare const bindKey: (key: KeyCode, fun: () => void, element?: HTMLElement) => void;
export declare const camelCase: (str: string) => string;
export declare const pluralize: (word: string, count: number) => string;
export declare const addPropsToChildren: (children: ReactNode, conditions: (child: ReactElement<any>) => boolean, newProps: object) => ReactNode;
export declare const getPositionAroundElement: (x: number, y: number, distance: number, childCount: number) => {
    x: number;
    y: number;
}[];
export declare const clamp: (value: number, min: number, max: number) => number;
export declare function mergeRefs<T>(...refs: (Ref<T> | undefined)[]): Ref<T>;
