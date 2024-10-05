declare const useSub: (event: String | Symbol, fun: () => void) => () => void;
declare const usePub: () => (event: String | Symbol) => void;
export { useSub, usePub };
