import { isValidElement } from "react";
import { useBase, useDelayed } from "../../hooks";
import { ListItemObject, type ListItem } from "./types";

const Item = (props : { meta: ListItem }) => {

    const { meta } = props
    const mounted = useDelayed()
    const { label, ...pops } = isValidElement(meta) ? {} : meta as ListItemObject;
    
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


    if ( isValidElement(meta) ){
        return <li 
            style={style}
            className={className}>{meta}</li>
    }

    return <li 
        style={style}
        className={className}
        {...rest}>{typeof meta == `string` ? meta : label}</li>

}

Item.displayName = `Zuz.ListItem`

export default Item