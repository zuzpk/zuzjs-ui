import { ReactNode } from "react";
import { Props } from "../../types";
import { Size } from "../../types/enums";
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
    items: ListItem[],
    ol?: boolean
}