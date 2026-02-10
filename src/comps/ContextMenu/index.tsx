import { createElement, Ref, useImperativeHandle, useRef, useState, MouseEvent as ReactMouseEvent, useEffect } from "react"
import { ContextItem, ContextMenuHandler, ContextMenuProps, MenuItemProps } from "./types"
import useBase from "../../hooks/useBase";
import Box from "../Box";
import { BoxProps, ORIGIN, TRANSITION_CURVES } from "../../types";
import { useFx, useMorph } from "../../hooks";
import MenuItem from "./item";
import { useAnchorPosition, useDelayed, useMounted } from "@zuzjs/hooks";

const ContextMenu = ({
    ref,
    ...props
} : ContextMenuProps & {
    // ref?: Ref<ContextMenuHandler>
}) => {

    const { 
        id, 
        as, 
        offsetX, 
        offsetY, 
        parent, 
        event,
        when: isVisible,
        items: _items, header, footer, 
        origin :  preferredAnchor = ORIGIN.TopRight, 
        ...pops 
    } = props;
    
    const [visible, setVisible] = useState(false);
    const [ items, setItems ] = useState<ContextItem[]>(_items || [])
    const { position, targetRef, calculatedAnchor } = useAnchorPosition(
        parent?.current!, 
        event as any, 
        { offsetX, offsetY, preferredAnchor }
    )

    // const { 
    //     style: morphStyle,
    //     isMeasured,
    //     sourceRect, 
    // } = useMorph(parent || { current: null }, isVisible ?? mounted);

    useEffect(() => {
        if (isVisible && position.top !== 0) {
            setVisible(true);
        } else if (!isVisible) {
            setVisible(false);
        }
    }, [isVisible, position]);

    const {
        className,
        style,
        rest
    } = useBase(pops);

    const contextAnimation = useFx({
        from: { opacity: 0, scale: 0.8, y: -10 },
        to: { opacity: 1, scale: 1, y: 0 },
        curve: TRANSITION_CURVES.EaseInOut,
        duration: 0.05,
        when: visible
    })

    return <Box
        className={`--contextmenu abs flex cols ${className}`.trim()}
        aria-hidden={!visible}
        style={{
            ...style,
            ...contextAnimation.style,
            top: position.top,
            left: position.left,
            // visibility: isMeasured ? `visible` : `hidden`,
            overflow: `hidden`,
            transformOrigin: calculatedAnchor,
        }}
        {...rest as BoxProps}>
        {typeof header == `function` ? createElement(header) : header}
        {items.map((item, index) => <MenuItem
            key={`context-${item.label.toLowerCase()}-${index}`}
            {...{ ...item, index} as MenuItemProps } />)}
        {typeof footer == `function` ? createElement(footer) : footer}
    </Box>


}

ContextMenu.displayName = `Zuz.ContextMenu`

export default ContextMenu