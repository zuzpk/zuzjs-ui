import { ReactNode } from "react";
import { animationProps } from "./base";
declare const Heading: import("react").ForwardRefExoticComponent<{
    as?: string;
    h?: number | string;
    html?: ReactNode | string;
    animate?: animationProps;
} & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export default Heading;
