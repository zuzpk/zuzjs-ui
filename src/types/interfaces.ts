import { CSSProperties, DetailedHTMLProps, HTMLAttributes, JSXElementConstructor, ReactElement, ReactEventHandler, ReactNode, ReactPortal, Ref } from "react";

export interface UIProps<T extends HTMLElement> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
    [key: string] : any
    // children?: ReactNode | undefined;
    // children?: string | number | bigint | true | ReactElement | Iterable<ReactNode> | ReactPortal;
    // children?: string | number | bigint | true | ReactElement<unknown, string | JSXElementConstructor<any>> | ReactPortal | Iterable<ReactNode> | undefined;
    // [key: string]: 
    //     | string 
    //     | number 
    //     | boolean 
    //     | undefined 
    //     | ReactNode 
    //     | ReactEventHandler<T> 
    //     | Ref<T> 
    //     | string[] 
    //     | string[][] 
    //     | ((v: any) => boolean)
    //     | bigint 
    //     | true 
    //     | ReactElement<unknown, string | JSXElementConstructor<any>> 
    //     | Iterable<ReactNode> 
    //     | ReactPortal 
    //     | CSSProperties 
    //     | { __html: string | TrustedHTML; };
}