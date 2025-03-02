declare const useDebounce: <T extends (...args: any[]) => void>(func: T, delay: number) => (...args: Parameters<T>) => void;
export default useDebounce;
