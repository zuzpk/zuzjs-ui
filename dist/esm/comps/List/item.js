import { jsx as _jsx } from "react/jsx-runtime";
import { useBase, useDelayed } from "../../hooks";
const Item = (props) => {
    const { meta } = props;
    const mounted = useDelayed();
    const { label, ...pops } = meta;
    const { className, style, rest } = useBase({
        ...pops,
        ...(pops.animate ? { animate: {
                ...pops.animate,
                when: mounted
            } } : {})
    });
    return _jsx("li", { style: style, className: className, ...rest, children: typeof meta == `string` ? meta : label });
};
Item.displayName = `ListItem`;
export default Item;
