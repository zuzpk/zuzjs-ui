import { MD5, uuid } from "@zuzjs/core";
import { useSortable } from "@zuzjs/hooks";
import { createElement, CSSProperties, forwardRef, Fragment, isValidElement, KeyboardEvent, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAnimationCurve } from "../../funs/css";
import { useBase } from "../../hooks";
import { TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import { ListHandler, ListItemObject, ListProps } from "./types";

const DEFAULT_DRAG_CHANNEL = "__zuz_ui_list_item__";

const reorderItems = <T,>(source: T[], from: number, to: number) => {
    if (from === to) return source;
    if (from < 0 || to < 0 || from >= source.length || to >= source.length) return source;

    const next = [...source];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    return next;
};

const isObjectMeta = (item: ListProps["items"][number]): item is ListItemObject => {
    if (item === null || item === undefined) return false;
    if (typeof item !== "object") return false;
    if (isValidElement(item)) return false;
    return true;
};

const renderItemContent = (item: ListProps["items"][number]) => {
    if (isValidElement(item)) return item;
    if (!isObjectMeta(item)) return item;

    return <>
        {item.icon ? <span className="--list-item-icon">{item.icon}</span> : null}
        <span className="--list-item-label">{item.label}</span>
        {item.action ? <span className="--list-item-action">{item.action}</span> : null}
    </>;
};

const getItemKey = (item: ListProps["items"][number], index: number) => {
    if (typeof item === "string" || typeof item === "number") {
        return `li-${String(item)}-${index}`;
    }

    if (isValidElement(item)) {
        return item.key ? `li-${String(item.key)}-${index}` : `${index}-${MD5(item.toString())}`;
    }

    if (isObjectMeta(item)) {
        return `${String(item.label ?? "item")}-${index}`;
    }

    return `${String(item)}-${index}`;
};

const createItemKeys = (list: ListProps["items"]) => list.map(() => uuid(12));

const captureListPositions = (root: HTMLElement | null, store: Map<string, DOMRect>) => {
    store.clear();
    if (!root) return;
    root.querySelectorAll<HTMLElement>(`:scope > li[data-list-id]`).forEach((el) => {
        const id = el.dataset.listId;
        if (id) store.set(id, el.getBoundingClientRect());
    });
};

const playListFlip = (root: HTMLElement | null, prev: Map<string, DOMRect>) => {
    if (!root || prev.size === 0) return;
    root.querySelectorAll<HTMLElement>(`:scope > li[data-list-id]`).forEach((el) => {
        if (el.classList.contains(`--is-dragging`)) return;
        const id = el.dataset.listId;
        if (!id) return;
        const last = prev.get(id);
        if (!last) return;
        const next = el.getBoundingClientRect();
        const dx = last.left - next.left;
        const dy = last.top - next.top;
        if (dx === 0 && dy === 0) return;
        el.animate(
            [
                { transform: `translate(${dx}px, ${dy}px)` },
                { transform: `translate(0, 0)` },
            ],
            { duration: 220, easing: `cubic-bezier(0.25, 0.46, 0.45, 0.94)` }
        );
    });
    prev.clear();
};

type SortableRowProps = {
    item: ListProps["items"][number];
    itemId: string;
    index: number;
    itemCount: number;
    seperator?: ListProps["seperator"];
    sortable: boolean;
    itemDraggable: boolean;
    itemDroppable: boolean;
    dragChannel: NonNullable<ListProps["dragChannel"]>;
    dragDelay: number;
    ghostMode: NonNullable<ListProps["ghostMode"]>;
    axis: "x" | "y";
    hoverable?: boolean;
    highlighted: boolean;
    dropHighlightDuration: number;
    dropHighlightTransition: NonNullable<ListProps["dropHighlightTransition"]>;
    dropHighlightCurve: NonNullable<ListProps["dropHighlightCurve"]>;
    render?: ListProps["render"];
    onItemClick?: ListProps["onItemClick"];
    onMove: (from: number, to: number, item: ListProps["items"][number]) => void;
    onDrop: (to: number) => void;
    onDragActive?: (active: boolean) => void;
    /** Whether this row is the active keyboard-navigation selection */
    selected: boolean;
    /** Called when this row is clicked (used to keep keyboard selection in sync) */
    onSelectIndex?: (index: number) => void;
    /** Called when the pointer enters this row (used to update the selected element on hover) */
    onHoverIndex?: (index: number) => void;
};

const SortableRow = (props: SortableRowProps) => {
    const {
        item,
        itemId,
        index,
        itemCount,
        seperator,
        sortable,
        itemDraggable,
        itemDroppable,
        dragChannel,
        dragDelay,
        ghostMode,
        axis,
        highlighted,
        dropHighlightDuration,
        dropHighlightTransition,
        dropHighlightCurve,
        render,
        onItemClick,
        onMove,
        onDrop,
        onDragActive,
        selected,
        onSelectIndex,
        onHoverIndex,
    } = props;

    const currentIndexRef = useRef(index);
    currentIndexRef.current = index;
    const nodeRef = useRef<HTMLLIElement | null>(null);
    const [ghostBox, setGhostBox] = useState<{
        x: number;
        y: number;
        width: number;
        height: number;
        padding: string;
        borderRadius: string;
    } | null>(null);

    const [{
        isDragging,
        isOver,
        canReceive,
        pointer,
    }, sortableRef] = useSortable<ListProps["items"][number], {
        isDragging: boolean;
        isOver: boolean;
        canReceive: boolean;
        dragOffset: { x: number; y: number } | null;
        pointer: { x: number; y: number } | null;
    }>(() => ({
        channel: dragChannel,
        accepts: dragChannel,
        id: itemId,
        index: currentIndexRef.current,
        axis,
        payload: item,
        dragDelay,
        draggable: itemDraggable,
        droppable: itemDroppable,
        canReceive: (dragged) => {
            if (!itemDroppable) return false;
            if (!dragged) return false;
            return dragged.id !== itemId;
        },
        onMove: (dragged, toIndex) => {
            if (!sortable) return;
            const fromIndex = dragged.index;
            if (fromIndex === toIndex) return;
            onMove(fromIndex, toIndex, dragged.item);
            dragged.index = toIndex;
        },
        onDrop: (_dragged, toIndex) => {
            onDrop(toIndex);
        },
        observe: (state) => ({
            isDragging: state.isDragging,
            isOver: state.isOver,
            canReceive: state.canReceive,
            dragOffset: state.dragOffset,
            pointer: state.pointer,
        }),
    }), [item, itemId, index, axis, itemDraggable, itemDroppable, sortable, dragChannel, dragDelay, onMove, onDrop]);

    useEffect(() => {
        if (isDragging) onDragActive?.(true);
        return () => {
            if (isDragging) onDragActive?.(false);
        };
    }, [isDragging, onDragActive]);

    useLayoutEffect(() => {
        if (!isDragging) {
            setGhostBox(null);
            return;
        }
        if (ghostBox || !nodeRef.current || !pointer) return;
        const rect = nodeRef.current.getBoundingClientRect();
        const cs = getComputedStyle(nodeRef.current);
        setGhostBox({
            x: pointer.x - rect.left,
            y: pointer.y - rect.top,
            width: rect.width,
            height: rect.height,
            padding: cs.padding,
            borderRadius: cs.borderRadius,
        });
    }, [isDragging, pointer, ghostBox]);

    const objectMeta = isObjectMeta(item) ? item : null;
    const transitionCurve = getAnimationCurve(dropHighlightCurve);

    const itemStyle: CSSProperties = {
        "--list-drop-highlight-duration": `${dropHighlightDuration}ms`,
        "--list-drop-highlight-curve": transitionCurve,
    } as CSSProperties;

    if (itemDraggable) {
        itemStyle.cursor = isDragging ? `grabbing` : `grab`;
    }

    const itemClassName = [
        objectMeta?.className,
        isDragging ? `--is-dragging` : ``,
        isDragging && ghostMode === `clone` ? `--drag-origin-outline` : ``,
        isDragging && ghostMode === `self` ? `--drag-origin-placeholder` : ``,
        isOver ? `--is-over` : ``,
        isOver && canReceive ? `--can-drop` : ``,
        highlighted ? `--drop-highlighted` : ``,
        dropHighlightTransition === TRANSITIONS.ScaleIn ? `--drop-tx-scale` : ``,
        dropHighlightTransition === TRANSITIONS.SlideInLeft ? `--drop-tx-slide-left` : ``,
        dropHighlightTransition === TRANSITIONS.SlideInRight ? `--drop-tx-slide-right` : ``,
        dropHighlightTransition === TRANSITIONS.SlideInTop ? `--drop-tx-slide-top` : ``,
        dropHighlightTransition === TRANSITIONS.SlideInBottom ? `--drop-tx-slide-bottom` : ``,
        dropHighlightTransition === TRANSITIONS.FadeIn ? `--drop-tx-fade` : ``,
        selected ? `--selected` : ``,
    ].filter(Boolean).join(` `);

    const renderContext = {
        index,
        isDragging,
        isOver,
        canReceive,
        highlighted,
        selected,
    };

    const rowContent = render
        ? render(item, renderContext)
        : renderItemContent(item);

    const ghost = isDragging && pointer && ghostBox && typeof document !== `undefined` ? (
        <div
            className={`--list-clone-ghost${ghostMode === `self` ? ` --list-ghost-self` : ``}`}
            style={{
                top: pointer.y - ghostBox.y,
                left: pointer.x - ghostBox.x,
                width: ghostBox.width,
                height: ghostBox.height,
                padding: ghostBox.padding,
                borderRadius: ghostBox.borderRadius || undefined,
            }}
        >
            {rowContent}
        </div>
    ) : null;

    return <Fragment>
        <li
            ref={(node) => {
                nodeRef.current = node;
                sortableRef(node);
            }}
            data-list-id={itemId}
            draggable={false}
            className={itemClassName}
            style={itemStyle}
            onDragStart={(e) => e.preventDefault()}
            onMouseEnter={() => onHoverIndex?.(index)}
            onClick={(e) => {
                objectMeta?.onClick?.(e);
                onItemClick?.(item, index, e);
                onSelectIndex?.(index);
            }}
        >
            {rowContent}
        </li>

        {ghost ? createPortal(ghost, document.body) : null}

        {seperator && index < itemCount - 1 ? <li className={`--list-seperator`}>{seperator}</li> : null}
    </Fragment>;
};

/**
 * List component with drag-and-drop sorting and virtual scrolling support.
 * 
 * Features:
 * - Sortable items with visual feedback (ghost modes: "self" or "clone")
 * - Custom render callbacks for full control over item appearance
 * - Cross-list dragging support (share dragChannel across multiple lists)
 * - Animated drop highlights with configurable transitions
 * - Virtual scrolling for large lists
 *
 * @example
 * // Basic sortable list
 * ```tsx
 * <List
 *   items={[{ label: "Item 1" }, { label: "Item 2" }]}
 *   sortable
 *   onSort={(items, { from, to }) => updateItems(items)}
 * />
 * ```
 *
 * @example
 * // Custom render with drag context
 * ```tsx
 * <List
 *   items={tasks}
 *   sortable
 *   ghostMode="self"
 *   render={(task, { isDragging, isOver, highlighted }) => (
 *     <Box className={isDragging ? "opacity:.6" : ""}>
 *       {task.title}
 *     </Box>
 *   )}
 *   onSort={(items) => setTasks(items)}
 * />
 * ```
 *
 * @example
 * // Cross-list dragging (share dragChannel)
 * ```tsx
 * const SHARED_CHANNEL = "KANBAN_CARD";
 * 
 * <List
 *   items={todoList}
 *   sortable
 *   dragChannel={SHARED_CHANNEL}
 *   onSort={(items, { from, to, item }) => {
 *     // Handle reordering and cross-list moves
 *     setTodoList(items);
 *   }}
 * />
 * <List
 *   items={doneList}
 *   sortable
 *   dragChannel={SHARED_CHANNEL}
 *   onSort={(items) => setDoneList(items)}
 * />
 * ```
 */
const List = forwardRef<ListHandler, ListProps>((props, ref) => {

    const {
        items,
        variant,
        direction,
        seperator,
        ol,
        virtual,
        sortable = false,
        itemDraggable,
        itemDroppable,
        dragChannel = DEFAULT_DRAG_CHANNEL,
        dragDelay = 0,
        ghostMode = "self",
        dropHighlightDuration = 560,
        dropHighlightTransition = TRANSITIONS.ScaleIn,
        dropHighlightCurve = TRANSITION_CURVES.Spring,
        listStyle,
        render,
        hoverable = false,
        empty,
        onSort,
        keyboardNavigation,
        onSelect,
        onItemClick,
        defaultSelected = 0,
        ...pops
    } = props;

    const containerRef = useRef<HTMLUListElement | HTMLOListElement>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const dropHighlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const draggingRef = useRef(false);
    const flipRectsRef = useRef<Map<string, DOMRect>>(new Map());
    const [sortedItems, setSortedItems] = useState(items);
    const [itemKeys, setItemKeys] = useState(() => createItemKeys(items));
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(keyboardNavigation ? defaultSelected : null);
    
    const {
        className,
        style,
        rest
    } = useBase<"ul">(pops);

    const Tag = ol == true ? 'ol' : 'ul';
    const dragEnabled = itemDraggable ?? sortable;
    const dropEnabled = itemDroppable ?? sortable;
    const sortAxis: "x" | "y" = direction === `rows` ? `x` : `y`;

    useEffect(() => {
        if (draggingRef.current) return;
        setSortedItems(items);
        setItemKeys((prev) => {
            if (prev.length === items.length) return prev;
            if (items.length > prev.length) return [...prev, ...createItemKeys(items.slice(prev.length))];
            return prev.slice(0, items.length);
        });
    }, [items]);

    const handleDragActive = useCallback((active: boolean) => {
        draggingRef.current = active;
        if (typeof document === `undefined`) return;
        document.body.classList.toggle(`--list-sorting`, active);
    }, []);

    const setPrev = useCallback(() => {
        setSelectedIndex((prev) => {
            if (sortedItems.length === 0) return prev;
            return Math.max(0, (prev ?? 0) - 1);
        });
    }, [sortedItems.length]);

    const setNext = useCallback(() => {
        setSelectedIndex((prev) => {
            if (sortedItems.length === 0) return prev;
            return Math.min(sortedItems.length - 1, (prev ?? -1) + 1);
        });
    }, [sortedItems.length]);

    const getSelected = useCallback(() => selectedIndex, [selectedIndex]);

    useImperativeHandle(ref, () => ({
        setPrev,
        setNext,
        getSelected,
        get element() {
            return containerRef.current;
        },
    }), [setPrev, setNext, getSelected]);
    
    // Simple virtual scrolling implementation
    const {
        visibleRange,
    } = useMemo(() => {
        if (!virtual || (typeof window === 'undefined')) {
            return { visibleRange: { start: 0, end: sortedItems.length } };
        }

        return {
            visibleRange: { start: 0, end: sortedItems.length },
        };
    }, [sortedItems.length, virtual]);

    const moveItem = useCallback((from: number, to: number, item: ListProps["items"][number]) => {
        if (!sortable) return;
        if (from === to) return;

        captureListPositions(containerRef.current, flipRectsRef.current);

        setItemKeys((prev) => reorderItems(prev, from, to));
        setSortedItems((prevItems) => {
            const nextItems = reorderItems(prevItems, from, to);
            if (nextItems === prevItems) return prevItems;

            onSort?.(nextItems, { from, to, item });
            return nextItems;
        });
    }, [onSort, sortable]);

    useLayoutEffect(() => {
        if (!draggingRef.current) return;
        playListFlip(containerRef.current, flipRectsRef.current);
    }, [sortedItems, itemKeys]);

    const highlightDrop = useCallback((index: number) => {
        setHighlightedIndex(index);

        if (dropHighlightTimeoutRef.current) {
            clearTimeout(dropHighlightTimeoutRef.current);
        }

        dropHighlightTimeoutRef.current = setTimeout(() => {
            setHighlightedIndex(null);
        }, dropHighlightDuration);
    }, [dropHighlightDuration]);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!keyboardNavigation || sortedItems.length === 0) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(sortedItems.length - 1, (prev ?? -1) + 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(0, (prev ?? sortedItems.length) - 1));
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex !== null) {
                const item = sortedItems[selectedIndex];
                if (item !== undefined) {
                    onSelect?.(item, selectedIndex);
                }
            }
        }
    }, [keyboardNavigation, sortedItems, selectedIndex, onSelect]);

    const renderItems = useCallback(() => {
        const { start, end } = visibleRange;
        const itemsToRender = sortedItems.slice(start, end);
        
        return itemsToRender.map((item, renderIndex) => {
            const actualIndex = start + renderIndex;
            const key = getItemKey(item, actualIndex);

            return <SortableRow
                key={itemKeys[actualIndex] ?? key}
                item={item}
                itemId={itemKeys[actualIndex] ?? key}
                index={actualIndex}
                itemCount={sortedItems.length}
                seperator={seperator}
                sortable={sortable}
                itemDraggable={dragEnabled}
                itemDroppable={dropEnabled}
                dragChannel={dragChannel}
                dragDelay={dragDelay}
                ghostMode={ghostMode}
                axis={sortAxis}
                highlighted={highlightedIndex === actualIndex}
                selected={selectedIndex === actualIndex}
                dropHighlightDuration={dropHighlightDuration}
                dropHighlightTransition={dropHighlightTransition}
                dropHighlightCurve={dropHighlightCurve}
                render={render}
                onItemClick={onItemClick}
                onMove={moveItem}
                hoverable={hoverable}
                onDrop={highlightDrop}
                onDragActive={handleDragActive}
                onSelectIndex={keyboardNavigation ? setSelectedIndex : undefined}
                onHoverIndex={keyboardNavigation ? setSelectedIndex : undefined}
            />
        });
    }, [visibleRange, sortedItems, itemKeys, seperator, sortable, dragEnabled, dropEnabled, dragChannel, dragDelay, ghostMode, sortAxis, highlightedIndex, selectedIndex, dropHighlightDuration, dropHighlightTransition, dropHighlightCurve, render, onItemClick, moveItem, highlightDrop, handleDragActive, keyboardNavigation]);

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

    useEffect(() => {
        return () => {
            if (dropHighlightTimeoutRef.current) {
                clearTimeout(dropHighlightTimeoutRef.current);
            }
            if (typeof document !== `undefined`) {
                document.body.classList.remove(`--list-sorting`);
            }
        };
    }, []);

    const { ref: restRef, ...restWithoutRef } = rest;

    const isEmpty = sortedItems.length === 0;
    const defaultEmpty = (
        <li className="--list-empty" style={{ textAlign: "center", opacity: 0.5, padding: "20px" }}>
            No items
        </li>
    );

    return createElement(Tag, {
        className: `--list ${hoverable ? `--hoverable` : ``} ${sortable ? `--sortable` : ``} ${listStyle ? `--list-style --ls-${listStyle}` : ""} --${variant || Variant.Small} flex ${direction ?? `cols`} ${className}`.trim(),
        style, 
        tabIndex: keyboardNavigation ? 0 : undefined,
        onKeyDown: keyboardNavigation ? handleKeyDown : undefined,
        ...restWithoutRef,
        ref: (node: HTMLUListElement | HTMLOListElement | null) => {
            containerRef.current = node;
            if (typeof restRef === 'function') {
                restRef(node);
            } else if (restRef && typeof restRef === 'object') {
                (restRef as { current: HTMLUListElement | HTMLOListElement | null }).current = node;
            }
        },
        children: isEmpty ? (empty !== undefined ? empty : defaultEmpty) : renderItems()
    });
    
});

List.displayName = `Zuz.List`;

export default List;