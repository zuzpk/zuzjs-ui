import { ZuzStyleString } from "../types";
export declare const setZuzMap: (map: Record<string, string>) => void;
export declare const getZuzMap: () => Record<string, string>;
/**
 * Converts Zuz utility strings or arrays into hashed class names.
 */
export declare const buildClassString: (input: ZuzStyleString | ZuzStyleString[]) => string;
/**
 * Standalone CSS utility for non-zuzjs components.
 */
export declare const css: (input: ZuzStyleString | ZuzStyleString[]) => string;
