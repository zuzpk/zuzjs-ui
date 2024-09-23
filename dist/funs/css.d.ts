import { dynamicObject } from "../types";
import Hashids from "hashids";
declare class CSS {
    cx: string[];
    cache: dynamicObject;
    PROPS: dynamicObject;
    DIRECT: dynamicObject;
    hashids: Hashids;
    chars: string;
    rgbaRegex: RegExp;
    IGNORE: string[];
    unit: any;
    keysWithoutCommaToSpace: string[];
    propCounter: dynamicObject;
    seperator: string;
    pseudoList: string[];
    ids: string[];
    constructor(options?: dynamicObject | undefined);
    styleSheet(cache: dynamicObject, pseudo?: string): string;
    _styleSheet(cache: dynamicObject): string;
    cleanKey(key: string): string;
    deepClean(cache: dynamicObject, level?: number): dynamicObject;
    makeUnit(k: string, v: any): any;
    makeValue(k: string, v: any): string;
    calcIndexes(str: string): string;
    mmakeID(k: string, v: string, _out: string): string;
    makeID(k: string, v: string, _out: string): string;
    lexer(line: string): dynamicObject;
    processLine(line: string): void;
    Build(css: string | string[][], cli?: boolean): {
        cx: string[];
        sheet: string;
    };
}
export default CSS;
export declare const buildWithStyles: (source: dynamicObject) => dynamicObject;
export declare const getAnimationCurve: (curve?: string) => string;
