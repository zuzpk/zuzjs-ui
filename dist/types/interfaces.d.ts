import { DetailedHTMLProps, HTMLAttributes } from "react";
export interface UIProps<T extends HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
    [key: string]: any;
}
