import { useAnchorPosition } from "@zuzjs/hooks";
import { createElement, Ref, useEffect, useMemo, useState } from "react";
import { useFx } from "../../hooks";
import useBase from "../../hooks/useBase";
import { BoxProps, ORIGIN, TRANSITION_CURVES, TRANSITIONS } from "../../types";
import Box from "../Box";
import MenuItem from "./item";
import { ContextItem, ContextMenuProps, MenuItemProps } from "./types";

const ContextMenu = ({
    ref,
    ...props
} : ContextMenuProps & {
    // ref?: Ref<ContextMenuHandler>
}) => {

    const { 
        id, 
        as, 
        fx,
        offsetX, 
        offsetY, 
        parent, 
        event,
        arrow,
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

    const isBottom = parent && position.top > parent.current!.getBoundingClientRect().bottom;
    const flipClass = isBottom ? '--arrow-top' : '--arrow-bottom';
    const arrowClass = useMemo(() => {
        const anchor = calculatedAnchor.toLowerCase();
        if (anchor.includes('left')) return '--arrow-left';
        if (anchor.includes('right')) return '--arrow-right';
        return '--arrow-center';
    }, [calculatedAnchor]);

    const isMeasured = position.top !== 0 || position.left !== 0;

    useEffect(() => {
        if (isVisible && isMeasured) {
            setVisible(true);
        } else if (!isVisible) {
            setVisible(false);
        }
    }, [isVisible, isMeasured]);

    const {
        className,
        style,
        rest
    } = useBase(pops);


    const contextAnimation = useFx({
        ...(fx?.transition ? {
            transition: fx.transition ?? TRANSITIONS.SlideInBottom
        } : {
            from: { opacity: 0, scale: 0.8, y: -10 },
            to: { opacity: 1, scale: 1, y: 0 }
        }),
        curve: fx?.curve ?? TRANSITION_CURVES.EaseInOut,
        duration: fx?.duration ?? 0.05,
        when: visible && isMeasured
    })

    
    return <Box
        ref={targetRef as Ref<HTMLDivElement>}
        className={`--contextmenu ${(arrow || parent != undefined || false) ? `--has-arrow ${flipClass} ${arrowClass}` : ``} abs flex cols ${className}`.trim()}
        aria-hidden={!visible}
        style={{
            ...style,
            ...contextAnimation.style,
            top: position.top,
            left: position.left,
            visibility: isMeasured ? `visible` : `hidden`,
            // overflow: `hidden`,
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