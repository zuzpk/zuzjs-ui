import { ReactNode } from "react";
import { BoxProps } from "../Box";

export type AccordionProps = BoxProps & {
    message?: string,
    title: string | ReactNode | ReactNode[],
}

export interface AccordionHandler {
    open: () => void,
    close: () => void,
}