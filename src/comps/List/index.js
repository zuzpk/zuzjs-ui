import { jsx as _jsx } from "react/jsx-runtime";
import { createElement, forwardRef } from "react";
import { useBase } from "../../hooks";
import { Size } from "../../types/enums";
import Item from "./item";
const List = forwardRef((props, ref) => {
    const { items, size, ol, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    const Tag = ol == true ? 'ol' : 'ul';
    return createElement(Tag, {
        className: `--list --${size || Size.Small} flex cols ${className}`.trim(),
        style, ref,
        ...rest,
        children: items.map((item, index) => _jsx(Item, { meta: item }, `list-item-${typeof item == `string` ? String(item) : item.label}-${index}`))
    });
});
export default List;
