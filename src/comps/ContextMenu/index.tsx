import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import Box, { BoxProps } from "../Box";
import { ContextMenuHandler, ContextMenuProps, MenuItemProps } from "./types";
import { useBase } from "../../hooks";
import MenuItem from "./item";
import { dynamicObject } from "../../types";

const ContextMenu = forwardRef<ContextMenuHandler, ContextMenuProps>((props, ref ) => {
    
    const { as, items, ...pops } = props;

    const {
        className,
        style,
        rest
    } = useBase(pops);

    const [ visible, setVisible ] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useImperativeHandle(ref, () => ({
      show: (e: MouseEvent | TouchEvent) => {
        // console.log(e)
        if (e instanceof MouseEvent) {
            setPosition({ x: e.clientX, y: e.clientY })
        } else if (e instanceof TouchEvent && e.touches.length > 0) {
            setPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY })
        }
        else{
            const { clientX: x, clientY: y } = e as dynamicObject
            setPosition({ x, y })
        }
        setVisible(true)
      },  
      hide: (e: MouseEvent | TouchEvent) => setVisible(false),  
    }))

    useEffect(() => {}, [visible, position])

    if ( !visible ) return null;

    return <Box
        className={`--contextmenu abs flex cols ${className}`.trim()}
        style={{
            ...style,
            top: position.y,
            left: position.x
        }}
        {...rest as BoxProps}>
        {items.map((item, index) => <MenuItem
            key={`context-${item.label.toLowerCase()}-${index}`}
            {...{ ...item, index} as MenuItemProps } />)}
    </Box>

});

export default ContextMenu