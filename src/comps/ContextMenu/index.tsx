import { useAnchorPosition } from "@zuzjs/hooks";
import { createElement, Fragment, Ref, useEffect, useMemo, useState } from "react";
import { useFx } from "../../hooks";
import useBase from "../../hooks/useBase";
import { BoxProps, ORIGIN, TRANSITION_CURVES, TRANSITIONS } from "../../types";
import Box from "../Box";
import MenuItem from "./item";
import { ContextItem, ContextItemConfig, ContextMenuProps } from "./types";

const isContextItemConfig = (item: ContextItem): item is ContextItemConfig => {
    return !!item && typeof item === `object` && `label` in item;
};

/**
 * ContextMenu component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ContextMenu items={[{ label: "Edit" }, { label: "Delete" }]}>Right-click here</ContextMenu>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ContextMenu items={[{ label: "Copy", icon: "copy" }, { label: "Paste", icon: "paste" }]} onSelect={(item) => console.log(item)}>Content</ContextMenu>
 * ```
 * @param items - Array of items
 * @param onSelect - Callback function triggered on selection
 */
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
        width,
        when: isVisible,
        items: _items, header, footer, 
        origin :  preferredAnchor = ORIGIN.TopRight, 
        ...pops 
    } = props;
    
    const [visible, setVisible] = useState(false);
    const [ items, setItems ] = useState<ContextItem[]>(_items || [])
    const { position, targetRef, calculatedAnchor, isPositioned } = useAnchorPosition(
        parent?.current!, 
        event as any, 
        { offsetX, offsetY, preferredAnchor }
    )

    // const isBottom = parent && position.top > parent.current!.getBoundingClientRect().bottom;
    // const flipClass = isBottom ? '--arrow-top' : '--arrow-bottom';
    // const arrowClass = useMemo(() => {
    //     const anchor = calculatedAnchor.toLowerCase();
    //     if (anchor.includes('left')) return '--arrow-left';
    //     if (anchor.includes('right')) return '--arrow-right';
    //     return '--arrow-center';
    // }, [calculatedAnchor]);
    
    const anchorStr = calculatedAnchor.toLowerCase();
    const isPlacedBelowTrigger = anchorStr.includes('top');    // Menu's top is at trigger
    const isPlacedAboveTrigger = anchorStr.includes('bottom'); // Menu's bottom is at trigger

    // 2. Set the CSS class for the arrow location
    // If placed below trigger, arrow is on top of menu.
    // If placed above trigger, arrow is on bottom of menu.
    const flipClass = isPlacedBelowTrigger ? '--arrow-top' : '--arrow-bottom';

    const arrowClass = useMemo(() => {
        if (anchorStr.includes('left')) return '--arrow-left';
        if (anchorStr.includes('right')) return '--arrow-right';
        return '--arrow-center';
    }, [anchorStr]);

    useEffect(() => {
        if (isVisible && isPositioned) {
            setVisible(true);
        } else if (!isVisible) {
            setVisible(false);
        }
    }, [isVisible, isPositioned]);

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
        when: visible && isPositioned
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
            visibility: isPositioned ? `visible` : `hidden`,
            // overflow: `hidden`,
            transformOrigin: calculatedAnchor,
            width,
        }}
        {...rest as BoxProps}>
        {typeof header == `function` ? createElement(header) : header}
        {items.map((item, index) => {
            if (typeof item === `function`) {
                return createElement(item, { key: `context-fn-${index}` });
            }

            if (isContextItemConfig(item)) {
                return <MenuItem
                    key={`context-${String(item.label).toLowerCase()}-${index}`}
                    {...item}
                    index={index} />;
            }

            return <Fragment key={`context-node-${index}`}>{item}</Fragment>;
        })}
        {typeof footer == `function` ? createElement(footer) : footer}
    </Box>


}

ContextMenu.displayName = `Zuz.ContextMenu`

export default ContextMenu