import { ReactNode } from "react";
import { BaseProps } from "../types/interfaces";
declare const Heading: import("react").ForwardRefExoticComponent<{
    h?: number | string;
    html?: ReactNode | string;
} & BaseProps & Omit<import("react").DetailedHTMLProps<import("react").HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>, "ref"> & import("react").RefAttributes<HTMLDivElement>>;
export default Heading;
