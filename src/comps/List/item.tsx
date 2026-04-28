import { isValidElement, ReactNode } from "react";
import { useBase } from "../../hooks";
import { ListItemMeta, type ListItem } from "./types";
import { useDelayed } from "@zuzjs/hooks";

const isItemMeta = (meta: ListItem): meta is ListItemMeta => {
    if (meta === null || meta === undefined) return false;
    if (typeof meta !== "object") return false;
    if (isValidElement(meta)) return false;
    return true;
};

const Item = (props : { children?: ReactNode, meta: ListItem }) => {

    const { meta, children } = props
    const mounted = useDelayed()
    const itemMeta = isItemMeta(meta) ? meta : null;
    const { label, ...pops } = itemMeta || {};
    
    const {
        className,
        style,
        rest
    } = useBase<`li`>({
        ...pops,
        ...(pops.animate ? { animate: {
            ...pops.animate, 
            when: mounted
        }} : {})
    })


    if (isValidElement(meta)) {
        return <li 
            style={style}
            className={className}>{meta}</li>
    }

    return <li 
        style={style}
        className={className}
        {...rest}>
            {children}
            {typeof meta == `string` ? meta : label}
        </li>

}

Item.displayName = `Zuz.ListItem`

export default Item