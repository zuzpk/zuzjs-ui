import { ComponentPropsWithoutRef, ElementType } from "react";
import { dynamicObject } from "../types";
import { TRANSITION_CURVES, TRANSITIONS } from "../types/enums";
export interface animationProps {
    transition?: TRANSITIONS;
    from?: dynamicObject;
    to?: dynamicObject;
    when?: boolean;
    duration?: number;
    delay?: number;
    curve?: string | TRANSITION_CURVES;
}
interface BaseProps<T extends ElementType> {
    tag?: T;
    as?: string | string[];
    className?: string;
    propsToRemove?: string[];
    animate?: animationProps;
}
export type Props<T extends ElementType> = BaseProps<T> & ComponentPropsWithoutRef<T>;
declare const With: import("react").ForwardRefExoticComponent<Omit<Props<ElementType>, "ref"> & import("react").RefAttributes<Element>>;
export default With;
