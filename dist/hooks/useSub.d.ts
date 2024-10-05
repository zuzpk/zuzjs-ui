declare const useSub: (event: String | Symbol, fun: () => void) => () => void;
declare const usePub: () => void;
export { useSub, usePub };
