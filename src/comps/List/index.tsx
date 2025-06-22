import { MD5 } from "@zuzjs/core";
import { createElement, forwardRef, Fragment, isValidElement } from "react";
import { useBase } from "../../hooks";
import { Size } from "../../types/enums";
import Item from "./item";
import { ListItemObject, ListProps } from "./types";

const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>((props, ref) => {

    const { items, size, direction, seperator, ol, ...pops } = props
    const {
        className,
        style,
        rest
    } = useBase<"ul">(pops)

    const Tag = ol == true ? 'ol' : 'ul';
    return createElement(Tag, {
        className: `--list --${size || Size.Small} flex ${direction ?? `cols`} ${className}`.trim(),
        style, ref, 
        ...rest,
        children: items.map((item, index, _items) => {
            const _key = `${typeof item == `string` ? `li-${String(item)}` : isValidElement(item) ? `li-${item.key}` || `${index}-${MD5(item.toString())}` : (item as ListItemObject).label}-${index}`
            return <Fragment key={_key}><Item 
                
                meta={item}
            />
            {seperator && _items[index+1] ? <li key={`spt-${index+1}-${_key}`} className={`--list-seperator`}>{seperator}</li> : null}
            </Fragment>
        })
    })
    
})

List.displayName = `Zuz.List`

export default List