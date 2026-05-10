String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '); }

export { default as __ZUZJS_UI_VERSION } from "./version";

export * from "./comps";
export * from "./funs";
export * from "./funs/css";
export * from "./hooks";
export * from "./types";

/** Visual Builder */
export * from "./builder/visual";
