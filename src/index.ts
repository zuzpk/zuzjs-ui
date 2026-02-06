String.prototype.trim = function(){ return this.replace(/^\s+|\s+$/g, '').replace(/\s+/g, ' '); }

export * from "./comps"
export * from "./types"
export * from "./hooks"
export * from "./funs"
export * from "./funs/css"