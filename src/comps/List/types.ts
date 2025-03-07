import { ReactNode } from "react";
import { Props } from "../../types";
import { Size, Variant } from "../../types/enums";
import { animationProps } from "../../types/interfaces";

export type ListItemObject = {
    icon?: ReactNode,
    label?: ReactNode,
    action?: ReactNode,
    className?: string,
    animate?: animationProps,
    onClick?: (event: any) => void,
}

export type ListItem = Props<`li`> & (ReactNode | ListItemObject)

export type ListProps = Props<`ul` | `ol`> & {
    size?: Size,
    variant?: Variant,
    items: ListItem[],
    direction?: "cols" | "rows",
    seperator?: ReactNode,
    ol?: boolean
}