import { useAnchorPosition } from "@zuzjs/hooks";
import { createElement, Fragment, Ref, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useFx } from "../../hooks";
import useBase from "../../hooks/useBase";
import { BoxProps, ORIGIN, TRANSITION_CURVES, TRANSITIONS } from "../../types";
import Box from "../Box";
import MenuItem from "./item";
import { ContextItem, ContextItemConfig, ContextMenuArrowAlign, ContextMenuArrowSide, ContextMenuProps } from "./types";

type ArrowSide = ContextMenuArrowSide;
type ArrowAlign = ContextMenuArrowAlign;

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
        arrowSide: forcedArrowSide,
        arrowAlign: forcedArrowAlign,
        width,
        when: isVisible,
        items: _items, header, footer, 
        origin :  preferredAnchor = ORIGIN.TopRight, 
        ...pops 
    } = props;
    
    const [visible, setVisible] = useState(false);
    const [items, setItems] = useState<ContextItem[]>(_items || []);
    const [arrowSide, setArrowSide] = useState<ArrowSide>("top");
    const [arrowAlign, setArrowAlign] = useState<ArrowAlign>("center");
    const [activeSubmenuIndex, setActiveSubmenuIndex] = useState<number | null>(null);
    const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number; side: "left" | "right" }>({
        top: 0,
        left: 0,
        side: "right"
    });

    const itemRefs = useRef<Map<number, HTMLButtonElement>>(new Map());
    const submenuRef = useRef<HTMLDivElement | null>(null);

    const { position, targetRef, calculatedAnchor, isPositioned } = useAnchorPosition(
        parent?.current!, 
        event as any, 
        { offsetX, offsetY, preferredAnchor }
    );
    
    const anchorStr = calculatedAnchor.toLowerCase();

    const resolveArrowPlacement = useCallback(() => {
        const menuEl = targetRef.current as HTMLDivElement | null;
        const parentEl = parent?.current || null;
        if (!menuEl) return;

        if (!parentEl) {
            const fallbackSide: ArrowSide = anchorStr.includes("bottom") ? "bottom" : "top";
            const fallbackAlign: ArrowAlign = anchorStr.includes("left")
                ? "left"
                : anchorStr.includes("right")
                    ? "right"
                    : "center";
            setArrowSide(fallbackSide);
            setArrowAlign(fallbackAlign);
            return;
        }

        const menuRect = menuEl.getBoundingClientRect();
        const parentRect = parentEl.getBoundingClientRect();

        const isRightOfParent = menuRect.left >= parentRect.right - 1;
        const isLeftOfParent = menuRect.right <= parentRect.left + 1;
        const isBelowParent = menuRect.top >= parentRect.bottom - 1;
        const isAboveParent = menuRect.bottom <= parentRect.top + 1;

        let side: ArrowSide = "top";
        // Prioritize horizontal docking when the menu is placed at parent's side.
        if (isRightOfParent) side = "left";
        else if (isLeftOfParent) side = "right";
        else if (isBelowParent) side = "top";
        else if (isAboveParent) side = "bottom";

        let align: ArrowAlign = "center";
        if (side === "top" || side === "bottom") {
            const parentCenterX = parentRect.left + parentRect.width / 2;
            const ratio = (parentCenterX - menuRect.left) / Math.max(menuRect.width, 1);
            align = ratio < 0.33 ? "left" : ratio > 0.67 ? "right" : "center";
        } else {
            const parentCenterY = parentRect.top + parentRect.height / 2;
            const ratio = (parentCenterY - menuRect.top) / Math.max(menuRect.height, 1);
            align = ratio < 0.33 ? "top" : ratio > 0.67 ? "bottom" : "center";
        }

        if (forcedArrowSide) {
            side = forcedArrowSide;
            align = forcedArrowAlign || "center";
        }

        setArrowSide(side);
        setArrowAlign(align);
    }, [anchorStr, forcedArrowAlign, forcedArrowSide, parent, targetRef]);

    const updateSubmenuPosition = useCallback((anchorEl: HTMLElement) => {
        const submenuEl = submenuRef.current;
        if (!submenuEl) return;

        const anchorRect = anchorEl.getBoundingClientRect();
        const submenuRect = submenuEl.getBoundingClientRect();
        const viewportPadding = 8;
        const gap = 6;

        let side: "left" | "right" = "right";
        let left = anchorRect.right + gap;
        if (left + submenuRect.width > window.innerWidth - viewportPadding) {
            left = anchorRect.left - submenuRect.width - gap;
            side = "left";
        }
        if (left < viewportPadding) left = viewportPadding;

        let top = anchorRect.top;
        if (top + submenuRect.height > window.innerHeight - viewportPadding) {
            top = window.innerHeight - submenuRect.height - viewportPadding;
        }
        if (top < viewportPadding) top = viewportPadding;

        setSubmenuPosition({ top, left, side });
    }, []);

    useEffect(() => {
        if (isVisible && isPositioned) {
            setVisible(true);
        } else if (!isVisible) {
            setVisible(false);
            setActiveSubmenuIndex(null);
        }
    }, [isVisible, isPositioned]);

    useEffect(() => {
        setItems(_items || []);
    }, [_items]);

    useLayoutEffect(() => {
        if (!isPositioned || !visible) return;
        resolveArrowPlacement();
    }, [isPositioned, visible, position.left, position.top, resolveArrowPlacement]);

    useEffect(() => {
        if (activeSubmenuIndex === null || !visible) return;

        const anchorEl = itemRefs.current.get(activeSubmenuIndex);
        if (!anchorEl) return;

        const update = () => updateSubmenuPosition(anchorEl);
        const raf = window.requestAnimationFrame(update);

        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);

        const observer = new ResizeObserver(update);
        if (submenuRef.current) observer.observe(submenuRef.current);

        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
            observer.disconnect();
        };
    }, [activeSubmenuIndex, visible, updateSubmenuPosition]);

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
    });

    const shouldShowArrow = arrow || parent != undefined || false;

    const activeSubmenuItems = useMemo(() => {
        if (activeSubmenuIndex === null) return null;
        const item = items[activeSubmenuIndex];
        if (!isContextItemConfig(item)) return null;
        if (!item.submenu || item.submenu.length === 0) return null;
        return item.submenu;
    }, [activeSubmenuIndex, items]);

    
    return <>
        <Box
            ref={targetRef as Ref<HTMLDivElement>}
            onMouseLeave={(e: any) => {
                const next = e.relatedTarget as Node | null;
                if (next && submenuRef.current?.contains(next)) return;
                setActiveSubmenuIndex(null);
            }}
            className={`--contextmenu ${shouldShowArrow ? `--has-arrow --arrow-side-${arrowSide} --arrow-align-${arrowAlign}` : ``} abs flex cols ${className}`.trim()}
            aria-hidden={!visible}
            style={{
                ...style,
                ...contextAnimation.style,
                top: position.top,
                left: position.left,
                visibility: isPositioned ? `visible` : `hidden`,
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
                    const hasSubmenu = !!(item.submenu && item.submenu.length > 0);
                    return <MenuItem
                        key={`context-${String(item.label).toLowerCase()}-${index}`}
                        {...item}
                        index={index}
                        hasSubmenu={hasSubmenu}
                        itemRef={(node) => {
                            if (node) itemRefs.current.set(index, node);
                            else itemRefs.current.delete(index);
                        }}
                        onHover={() => {
                            if (!hasSubmenu) {
                                setActiveSubmenuIndex(null);
                                return;
                            }
                            setActiveSubmenuIndex(index);
                        }} />;
                }

                return <Fragment key={`context-node-${index}`}>{item}</Fragment>;
            })}
            {typeof footer == `function` ? createElement(footer) : footer}
        </Box>

        {activeSubmenuItems ? <Box
            ref={submenuRef as Ref<HTMLDivElement>}
            onMouseLeave={() => setActiveSubmenuIndex(null)}
            onMouseEnter={() => {
                if (activeSubmenuIndex !== null) {
                    const anchorEl = itemRefs.current.get(activeSubmenuIndex);
                    if (anchorEl) updateSubmenuPosition(anchorEl);
                }
            }}
            className={`--contextmenu --submenu --submenu-${submenuPosition.side} abs flex cols ${className}`.trim()}
            aria-hidden={!visible}
            style={{
                ...style,
                top: submenuPosition.top,
                left: submenuPosition.left,
                position: "fixed",
                visibility: isPositioned && visible ? `visible` : `hidden`,
                width,
            }}>
            {activeSubmenuItems.map((item, index) => {
                if (typeof item === `function`) {
                    return createElement(item, { key: `context-sub-fn-${index}` });
                }

                if (isContextItemConfig(item)) {
                    return <MenuItem
                        key={`context-sub-${String(item.label).toLowerCase()}-${index}`}
                        {...item}
                        index={index} />;
                }

                return <Fragment key={`context-sub-node-${index}`}>{item}</Fragment>;
            })}
        </Box> : null}
    </>


}

ContextMenu.displayName = `Zuz.ContextMenu`

export default ContextMenu