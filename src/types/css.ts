import type { cssDirect, cssProps } from "../builder/stylesheet";

// 1. Capture keys like "jcc", "abs", "tal" from cssDirect
type DirectKeys = keyof typeof cssDirect;

// 2. Capture keys like "bg", "w", "flex" from cssProps and add ":" 
// This creates "bg:" | "w:" | "flex:" etc.
type PropKeys = `${Extract<keyof typeof cssProps, string>}:`;

// 3. Combine them into the Auto-Generated Union
export type ZuzCommonValues = DirectKeys | PropKeys;

export type ZuzStyleString = ZuzCommonValues | (string & {}); // The & {} trick keeps intellisense working for literals while allowing any string

export type cssShortKey = keyof cssShortKeys
export type cssShortKeys = {
    w: string | number,
    minW: string | number,
    maxW: string | number,
    h: string | number,
    minH: string | number,
    maxH: string | number,
    x: string | number,
    y: string | number,
    z: string | number,
    r: string | number,
    rx: string | number,
    ry: string | number,
    rz: string | number,
    s: string | number,
    sx: string | number,
    sy: string | number,
    sz: string | number,
};