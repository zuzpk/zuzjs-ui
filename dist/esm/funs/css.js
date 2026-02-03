const ZUZ_MAP_KEY = Symbol.for("zuz.global.map");
export const setZuzMap = (map) => {
    globalThis[ZUZ_MAP_KEY] = map;
};
export const getZuzMap = () => {
    return globalThis[ZUZ_MAP_KEY] || {};
};
/**
 * Converts Zuz utility strings or arrays into hashed class names.
 */
export const buildClassString = (input) => {
    // 1. Normalize input to a single string
    const raw = Array.isArray(input) ? input.join(" ") : input;
    // Safety check for empty or non-string inputs
    if (!raw || typeof raw !== 'string')
        return "";
    const zuzMap = getZuzMap();
    // 2. Process and map tokens
    return raw
        .split(/\s+/)
        .filter(Boolean) // Remove empty strings from accidental double spaces
        .map(token => {
        /**
         * Check the manifest for the token.
         * If found, return the hash (e.g., "z123").
         * If not, return as-is (supports custom classes like "--sidebar").
         */
        return zuzMap[token] || token;
    })
        .join(" ");
};
/**
 * Standalone CSS utility for non-zuzjs components.
 */
export const css = (input) => {
    // 1. Normalize input: Join arrays or treat as single string
    const raw = Array.isArray(input) ? input.join(" ") : input;
    // Safety check for empty strings or undefined
    if (!raw || typeof raw !== 'string')
        return "";
    // 2. Process tokens: Split by whitespace
    // We use a regex split to handle multiple spaces or newlines gracefully
    return buildClassString(raw);
};
