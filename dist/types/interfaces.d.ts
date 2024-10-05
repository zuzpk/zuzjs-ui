import { DetailedHTMLProps, HTMLAttributes } from "react";
export interface FormatNumberParams {
    number: number | string;
    locale: string;
    style?: `decimal` | `currency` | `percent`;
    decimal?: number;
    currency?: {
        code: string;
        style: `symbol` | `code` | `name`;
        symbol?: string;
    };
}
export interface UIProps<T extends HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
    [key: string]: any;
}
