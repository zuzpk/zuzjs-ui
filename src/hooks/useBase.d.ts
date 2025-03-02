import { Props } from "../types";
import { ComponentPropsWithRef, CSSProperties, JSX } from "react";
declare const useBase: <T extends keyof JSX.IntrinsicElements>(props: Props<T>) => {
    style: CSSProperties;
    className: string;
    rest: ComponentPropsWithRef<T>;
};
export default useBase;
