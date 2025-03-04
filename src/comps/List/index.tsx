import { createElement, forwardRef } from "react";
import { useBase } from "../../hooks";
import { Size } from "../../types/enums";
import Item from "./item";
import { ListItemObject, ListProps } from "./types";

const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>((props, ref) => {

    const { items, size, ol, ...pops } = props
    const {
        className,
        style,
        rest
    } = useBase<"ul">(pops)

    const Tag = ol == true ? 'ol' : 'ul';
    return createElement(Tag, {
        className: `--list --${size || Size.Small} flex cols ${className}`.trim(),
        style, ref, 
        ...rest,
        children: items.map((item, index) => <Item 
            key={`list-item-${typeof item == `string` ? String(item) : (item as ListItemObject).label}-${index}`} 
            meta={item}
        />)
    })
    
})

List.displayName = `List`

export default List