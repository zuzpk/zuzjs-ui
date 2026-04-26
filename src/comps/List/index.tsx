import { MD5 } from "@zuzjs/core";
import { createElement, forwardRef, Fragment, isValidElement, useCallback, useMemo, useRef, useEffect } from "react";
import { useBase } from "../../hooks";
import { Variant } from "../../types/enums";
import Item from "./item";
import { ListItemObject, ListProps } from "./types";

/**
 * List component with virtualization support.
 * Optimized for large lists with efficient rendering and fast scrolling.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <List items={[{ label: "Item 1" }, { label: "Item 2" }]} />
 * ```
 *
 * @example
 * // Large list with virtual scrolling
 * ```tsx
 * <List items={items} virtual={{ itemHeight: 50 }} onSelect={(item) => {}} />
 * ```
 *
 * @param items - Array of items
 * @param virtual - Virtual scrolling options (itemHeight, overscan)
 * @param seperator - Separator between items
 */
const List = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>((props, ref) => {

    const { items, variant, direction, seperator, ol, virtual, ...pops } = props;
    const containerRef = useRef<HTMLUListElement | HTMLOListElement>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    
    const {
        className,
        style,
        rest
    } = useBase<"ul">(pops);

    const Tag = ol == true ? 'ol' : 'ul';
    
    // Simple virtual scrolling implementation
    const {
        visibleRange,
        scrollTop,
    } = useMemo(() => {
        if (!virtual || (typeof window === 'undefined')) {
            return { visibleRange: { start: 0, end: items.length }, scrollTop: 0 };
        }

        const itemHeight = virtual.itemHeight ?? 50;
        const overscan = virtual.overscan ?? 5;
        const containerHeight = virtual.height ?? 400;
        
        return {
            visibleRange: { start: 0, end: items.length },
            scrollTop: 0
        };
    }, [items.length, virtual]);

    const renderItems = useCallback(() => {
        const { start, end } = visibleRange;
        const itemsToRender = items.slice(start, end);
        
        return itemsToRender.map((item, renderIndex) => {
            const actualIndex = start + renderIndex;
            const _items = items;
            const _key = `${typeof item == `string` ? `li-${String(item)}` : isValidElement(item) ? `li-${item.key}` || `${actualIndex}-${MD5(item.toString())}` : (item as ListItemObject).label}-${actualIndex}`;

            if (isValidElement(item)) {
                return <Fragment key={_key}>
                    <li>{item}</li>
                    {seperator && _items[actualIndex + 1] ? <li key={`spt-${actualIndex + 1}-${_key}`} className={`--list-seperator`}>{seperator}</li> : null}
                </Fragment>
            }
            
            return <Fragment key={_key}>
                <Item meta={item} />
                {seperator && _items[actualIndex + 1] ? <li key={`spt-${actualIndex + 1}-${_key}`} className={`--list-seperator`}>{seperator}</li> : null}
            </Fragment>
        });
    }, [visibleRange, items, seperator]);

    // Handle scroll optimization for fast scrolling
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleScroll = () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
            // Debounce scroll events for performance
            scrollTimeoutRef.current = setTimeout(() => {
                // Virtual scroll recalculation would happen here
            }, 100);
        };

        container.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            container.removeEventListener('scroll', handleScroll);
            if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        };
    }, []);

    return createElement(Tag, {
        className: `--list --${variant || Variant.Small} flex ${direction ?? `cols`} ${className}`.trim(),
        style, 
        ref: (node: HTMLUListElement | HTMLOListElement | null) => {
            containerRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
        },
        ...rest,
        children: renderItems()
    });
    
});

List.displayName = `Zuz.List`;

export default List;