import { ReactNode, Ref } from "react";
import { BoxProps } from "../../types";

export type TableOfContentItem = {
    tag: string,
    label: string
}

export type TableOfContentsProps = BoxProps & {
    ref?: Ref<HTMLDivElement>,
    title?: ReactNode,
    items: TableOfContentItem[]
}