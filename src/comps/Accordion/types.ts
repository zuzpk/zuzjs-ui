import { ReactNode } from "react";
import { BoxProps } from "../../types/interfaces";

export type AccordionProps = BoxProps & {
    message?: string | ReactNode,
    title: string | ReactNode | ReactNode[],
}

export interface AccordionHandler {
    open: () => void,
    close: () => void,
}