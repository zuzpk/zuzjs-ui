String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '); }

export { default as Countries } from "./funs/countries";
export { default as __ZUZJS_UI_VERSION } from "./version";

export * from "./comps";
export * from "./funs";
export * from "./funs/css";
export * from "./hooks";
export * from "./types";
