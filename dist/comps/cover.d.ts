import { ComponentPropsWithoutRef } from "react";
import { animationProps } from "./base";
import { SpinnerProps } from "./spinner";
export interface CoverProps extends ComponentPropsWithoutRef<`div`> {
    tag?: string;
    message?: string;
    spinner?: SpinnerProps;
    color?: string;
    as?: string;
    animate?: animationProps;
    when?: boolean;
}
declare const Cover: import("react").ForwardRefExoticComponent<CoverProps & import("react").RefAttributes<HTMLDivElement>>;
export default Cover;
