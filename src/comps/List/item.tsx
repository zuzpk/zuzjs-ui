import { useBase, useDelayed } from "../../hooks";
import { ListItemObject, type ListItem } from "./types"

const Item = (props : { meta: ListItem }) => {

    const { meta } = props
    const mounted = useDelayed()
    const { label, ...pops } = meta as ListItemObject;

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


    return <li 
        style={style}
        className={className}
        {...rest}>{typeof meta == `string` ? meta : label}</li>

}

export default Item