declare const useSub: (event: String | Symbol, fun: () => void, context?: any) => () => void;
declare const usePub: () => (event: String | Symbol) => void;
export { useSub, usePub };
