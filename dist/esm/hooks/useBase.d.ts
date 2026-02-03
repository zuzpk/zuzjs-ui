import { ComponentPropsWithRef, CSSProperties, JSX, RefObject } from "react";
import { Props } from "../types";
declare const useBase: <T extends keyof JSX.IntrinsicElements>(props: Props<T>, ref?: RefObject<HTMLElement>) => {
    style: CSSProperties;
    className: string;
    rest: ComponentPropsWithRef<T>;
};
export default useBase;
