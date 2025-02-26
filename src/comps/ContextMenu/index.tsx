"use client"
import { forwardRef, MouseEvent, useEffect, useImperativeHandle, useRef, useState } from "react";
import Box, { BoxProps } from "../Box";
import { ContextItem, ContextMenuHandler, ContextMenuProps, MenuItemProps } from "./types";
import { useAnchorPosition, useBase } from "../../hooks";
import MenuItem from "./item";
import { TRANSITION_CURVES } from "../../types/enums";
// import { dynamicObject } from "../../types";

const ContextMenu = forwardRef<ContextMenuHandler, ContextMenuProps>((props, ref ) => {
    
    const { as, offsetX, offsetY, parent, items: _items, ...pops } = props;

    const {
        className,
        style,
        rest
    } = useBase(pops);
    const event = useRef<MouseEvent>(undefined)
    const [ visible, setVisible ] = useState(false);
    // const [_position, setPosition] = useState<{ x: number, y: number } | null>(null);
    // const [_parent, setParent] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [ items, setItems ] = useState<ContextItem[]>(_items || [])
    const { position, targetRef } = useAnchorPosition(parent!, event.current as any, { offsetX, offsetY })

    useImperativeHandle(ref, () => ({
      show: (e: MouseEvent<Element, MouseEvent> | TouchEvent, menuItems?: ContextItem[]) => {

        if ( !parent ) event.current = e as any;
        
        if (menuItems){
            setItems(menuItems)
        }
        setVisible(true)
      },  
      hide: (e: MouseEvent | TouchEvent) => setVisible(false),  
    }))

    return <Box
        className={`--contextmenu abs flex cols ${className}`.trim()}
        aria-hidden={!visible}
        style={{
            ...style,
            top: position.top,
            left: position.left
        }}
        animate={{
            from: { opacity: 0, y: 20 },
            to: { opacity: 1, y: 0 },
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.05,
            when: visible
        }}
        ref={targetRef}
        {...rest as BoxProps}>
        {items.map((item, index) => <MenuItem
            key={`context-${item.label.toLowerCase()}-${index}`}
            {...{ ...item, index} as MenuItemProps } />)}
    </Box>

});

export default ContextMenu