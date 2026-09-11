"use client"
import { _, clamp, uuid, withPost, withGet, dynamic } from "@zuzjs/core";
import { useAnchor, useDebounce } from "@zuzjs/hooks";
import { forwardRef, KeyboardEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import useBase from "../../hooks/useBase";
import { useTheme } from "../../hooks/useColorScheme";
import { Props, Variant } from "../../types";
import { TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import List from "../List";
import { ListHandler } from "../List/types";
import SVGIcons from "../svgicons";
import { AutoCompleteProps } from "./types";

const SELECT_OPEN_EVENT = "zuz-select-open";
const DEFAULT_DATA_KEY = `name`;

const isPlainItem = (item: unknown): item is dynamic => {
    return typeof item === `object` && item !== null && !Array.isArray(item);
};

const fieldToText = (value: unknown): string => {
    if (typeof value === `string`) return value.trim();
    if (typeof value === `number` && Number.isFinite(value)) return String(value);
    return ``;
};

const keysFromItems = (...sources: Array<Array<string | dynamic> | undefined>): string[] => {
    const keys: string[] = [];
    const seen = new Set<string>();

    for (const items of sources) {
        if (!items || !Array.isArray(items)) continue;
        for (const item of items) {
            if (!isPlainItem(item)) continue;
            for (const key of Object.keys(item)) {
                if (seen.has(key)) continue;
                if (!fieldToText(item[key])) continue;
                seen.add(key);
                keys.push(key);
            }
        }
        if (keys.length > 0) return keys;
    }

    return keys;
};

const toDataKeys = (dataKey?: string | string[], ...sources: Array<Array<string | dynamic> | undefined>): string[] => {
    if (dataKey !== undefined) {
        const list = Array.isArray(dataKey) ? dataKey : [dataKey];
        const keys = list.filter((key): key is string => typeof key === `string` && key.length > 0);
        if (keys.length > 0) return keys;
    }

    const inferred = keysFromItems(...sources);
    return inferred.length > 0 ? inferred : [DEFAULT_DATA_KEY];
};

const extractValue = (item: string | dynamic, keys: string[]): string => {
    if (typeof item === `string`) return item;
    const parts = keys.map((key) => fieldToText(item?.[key])).filter(Boolean);
    if (parts.length > 0) return parts.join(` `);
    return fieldToText(item?.name) || String(item);
};

const itemMatchesQuery = (item: string | dynamic, keys: string[], lowerQuery: string): boolean => {
    if (typeof item === `string`) return item.toLowerCase().includes(lowerQuery);
    if (keys.some((key) => fieldToText(item?.[key]).toLowerCase().includes(lowerQuery))) return true;
    return extractValue(item, keys).toLowerCase().includes(lowerQuery);
};

const wrapPrimitiveItem = (item: string, keys: string[]): dynamic => ({
    [keys[0] ?? DEFAULT_DATA_KEY]: item,
});

/**
 * AutoComplete component with support for static and dynamic data.
 *
 * @description
 * A searchable input component that provides suggestions from either:
 * - Static array of strings: ['Apple', 'Banana']
 * - Dynamic object array: [{name: 'Apple'}, {name: 'Banana'}]
 * - Dynamic API endpoint (dynamic prop with @zuzjs/core)
 *
 * @example
 * // Static string array
 * ```tsx
 * <AutoComplete
 *   data={["Apple", "Banana", "Cherry"]}
 *   placeholder="Search fruits..."
 * />
 * ```
 *
 * @example
 * // Dynamic object array (`dataKey` optional — inferred from object fields)
 * ```tsx
 * <AutoComplete
 *   data={[
 *     { id: 1, name: 'Apple', price: 1.99 },
 *     { id: 2, name: 'Banana', price: 0.99 }
 *   ]}
 *   dataKey="name"
 *   placeholder="Search fruits..."
 *   onSelect={(value, item) => console.log(value, item.price)}
 * />
 * ```
 *
 * @example
 * // Multiple object fields (search + joined label)
 * ```tsx
 * <AutoComplete
 *   data={[
 *     { firstName: 'Jane', lastName: 'Smith', email: 'jane@acme.com' }
 *   ]}
 *   dataKey={['firstName', 'lastName']}
 *   placeholder="Search people..."
 * />
 * ```
 *
 * @example
 * // Dynamic API search
 * ```tsx
 * <AutoComplete
 *   dynamic={{
 *     action: '/api/search',
 *     method: 'POST',
 *     queryParam: 'q',
 *     transformResponse: (data) => data.items
 *   }}
 *   placeholder="Search..."
 *   onSelect={(value) => console.log(value)}
 * />
 * ```
 *
 * @param data - Array of suggestions (strings or objects)
 * @param dataKey - Field(s) to extract from objects. If omitted, keys are inferred from `data`.
 * @param dynamic - Dynamic configuration for API fetching
 * @param onSelect - Callback when suggestion is selected
 * @param onChange - Callback when input value changes
 * @param renderOption - Custom renderer for suggestion items
 */
const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>((props, ref) => {

    const {
        fx,
        action: legacyAction,
        data,
        dataKey,
        dynamic: dynamicConfig,
        withStyle,
        onSelect,
        clearOnSelect,
        allowCustom,
        onChange,
        renderOption,
        loadingPlaceholder = 'Loading...',
        emptyPlaceholder = 'No results found',
        maxHeight,
        ...pops
    } = props

    const { className: autoCompleteStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
    const { style } = useBase(pops)
    const { variant: themeVariant } = useTheme(true)!

    const [choosing, setChoosing] = useState(false)
    const [items, setItems] = useState<string[]>([])
    const [rawItems, setRawItems] = useState<dynamic[]>([]) // Store original objects
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const innerRef = useRef<HTMLInputElement>(null)
    const suggestionRef = useRef<ListHandler>(null)
    const _container = useRef<HTMLDivElement>(null)
    const _pop = useRef<HTMLDivElement>(null)
    const committingRef = useRef(false)
    const propsRef = useRef(props)
    const itemsRef = useRef<string[]>([])
    const rawItemsRef = useRef<dynamic[]>([])
    const lastSuggestionsRef = useRef<string[]>([])
    const lastRawSuggestionsRef = useRef<dynamic[]>([])
    const lastQueryRef = useRef<string | null>(null)
    const highlightedIndexRef = useRef<number | null>(null)
    const loadingRef = useRef(false)
    const errorRef = useRef<string | null>(null)

    propsRef.current = props

    const _id = useMemo(() => pops.name || uuid(12), [])
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [lastQuery, setLastQuery] = useState<string | null>(null);
    const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);
    const [lastRawSuggestions, setLastRawSuggestions] = useState<dynamic[]>([]);

    itemsRef.current = items
    rawItemsRef.current = rawItems
    lastSuggestionsRef.current = lastSuggestions
    lastRawSuggestionsRef.current = lastRawSuggestions
    lastQueryRef.current = lastQuery
    loadingRef.current = loading
    errorRef.current = error

    // Resolve action URL - prioritize dynamic.action over legacy action prop
    const actionUrl = dynamicConfig?.action || legacyAction || null;
    const queryParam = dynamicConfig?.queryParam || 'query';
    const method = dynamicConfig?.method || 'POST';
    const transformResponse = dynamicConfig?.transformResponse || ((data: dynamic) => {
        // Default: expect { items: string[] }
        if (_(data.items).isArray()) {
            return data.items;
        }
        console.error('Response should contain items array or provide transformResponse');
        return [];
    });
    const minChars = dynamicConfig?.minChars || 1;
    const debounceMs = dynamicConfig?.debounce || 250;
    const dataKeys = toDataKeys(dataKey, data);

    /**
     * Filter static data based on input value
     */
    const filterStaticData = (query: string): { filtered: string[], raw: dynamic[] } => {
        if (!data || !Array.isArray(data)) return { filtered: [], raw: [] };

        const lowerQuery = query.toLowerCase();
        const matches: { filtered: string[], raw: dynamic[] } = { filtered: [], raw: [] };

        data.forEach((item) => {
            if (!itemMatchesQuery(item, dataKeys, lowerQuery)) return;
            matches.filtered.push(extractValue(item, dataKeys));
            matches.raw.push(typeof item === `string` ? wrapPrimitiveItem(item, dataKeys) : item);
        });

        return matches;
    };

    /**
     * Fetch suggestions from API
     */
    const fetchSuggestions = async (query: string) => {
        if (!actionUrl) return;

        setLoading(true);
        setError(null);

        try {
            const requestData = {
                [queryParam]: query,
                ...dynamicConfig?.params
            };

            const response = method === 'GET'
                ? await withGet<dynamic>(actionUrl, requestData)
                : await withPost<dynamic>(actionUrl, requestData);

            const suggestions = transformResponse(response);

            if (_(suggestions).isArray()) {
                const keys = toDataKeys(dataKey, suggestions, data);
                const processed: { items: string[], raw: dynamic[] } = { items: [], raw: [] };

                suggestions.forEach((item: string | dynamic) => {
                    const value = extractValue(item, keys);
                    processed.items.push(value);
                    processed.raw.push(typeof item === `string` ? wrapPrimitiveItem(item, keys) : item);
                });

                setItems(processed.items);
                setRawItems(processed.raw);
                setLastQuery(query);
                setLastSuggestions(processed.items);
                setLastRawSuggestions(processed.raw);
            } else {
                console.error('transformResponse should return an array');
                setItems([]);
                setRawItems([]);
            }
        } catch (err: any) {
            console.error('AutoComplete fetch error:', err);
            setError(err.message || 'Failed to fetch suggestions');
            setItems([]);
            setRawItems([]);
        } finally {
            setLoading(false);
            setHighlightedIndex(null);
            highlightedIndexRef.current = null;
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Notify parent of input change
        onChange?.(value);

        if (value === '') {
            setChoosing(false);
            setItems([]);
            setRawItems([]);
            return;
        }

        if (value.trim().length < minChars) {
            return;
        }

        setChoosing(true);

        if (actionUrl) {
            // Dynamic API search
            fetchSuggestions(value.trim());
        } else if (data) {
            // Static data filtering
            const { filtered, raw } = filterStaticData(value.trim());
            setItems(filtered);
            setRawItems(raw);
            setLastQuery(value);
            setLastSuggestions(filtered);
            setLastRawSuggestions(raw);
            setHighlightedIndex(null);
            highlightedIndexRef.current = null;
        }
    }

    const debounce = useDebounce(handleChange, debounceMs)

    const getCurrentSuggestions = useCallback(() => {
        const currentItems = itemsRef.current.length > 0 ? itemsRef.current : lastSuggestionsRef.current;
        const currentRaw = rawItemsRef.current.length > 0 ? rawItemsRef.current : lastRawSuggestionsRef.current;
        return { currentItems, currentRaw };
    }, []);

    const commitSelection = useCallback((item: string, rawItem?: dynamic) => {
        if (!item || committingRef.current) return;
        committingRef.current = true;

        const {
            onSelect: select,
            onChange: change,
            clearOnSelect: shouldClear,
        } = propsRef.current;

        if (innerRef.current) {
            innerRef.current.value = shouldClear === true ? `` : item;
        }

        setChoosing(false);
        setItems([]);
        setRawItems([]);
        setHighlightedIndex(null);
        highlightedIndexRef.current = null;

        select?.(item, rawItem);
        if (shouldClear === true) change?.(``);
    }, []);

    const updateInputValue = useCallback((index: number) => {
        const { currentItems } = getCurrentSuggestions();
        const selectedItem = currentItems[index];
        if (selectedItem && innerRef.current) {
            innerRef.current.value = selectedItem;
            innerRef.current.setSelectionRange(selectedItem.length, selectedItem.length);
        }
        const selectedItemElement = _pop.current?.querySelectorAll(`li`)[index] as HTMLElement | undefined;
        selectedItemElement?.scrollIntoView({ block: 'nearest' });
    }, [getCurrentSuggestions]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        const { currentItems, currentRaw } = getCurrentSuggestions();
        const typed = (innerRef.current?.value ?? ``).trim();
        const allowCustom = propsRef.current.allowCustom === true;

        if (e.key === 'Enter') {
            const highlighted = highlightedIndexRef.current;
            const pick = highlighted !== null && currentItems[highlighted] !== undefined
                ? highlighted
                : currentItems.findIndex((value) => value === typed);

            if (pick >= 0 && currentItems[pick] !== undefined) {
                e.preventDefault();
                e.stopPropagation();
                commitSelection(currentItems[pick], currentRaw[pick]);
                return;
            }

            if (allowCustom && typed) {
                e.preventDefault();
                e.stopPropagation();
                commitSelection(typed, wrapPrimitiveItem(
                    typed,
                    toDataKeys(propsRef.current.dataKey, propsRef.current.data, lastRawSuggestionsRef.current)
                ));
            }
            return;
        }

        if (currentItems.length === 0 && !lastQueryRef.current) return;

        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            e.stopPropagation();
        }

        if (e.key === 'Escape') {
            setHighlightedIndex(null);
            highlightedIndexRef.current = null;
            setChoosing(false);
            setItems([]);
            setRawItems([]);
            return;
        }

        if (e.key === 'ArrowDown') {
            setHighlightedIndex((prevIndex) => {
                const newIndex = prevIndex === null || prevIndex === currentItems.length - 1 ? 0 : prevIndex + 1;
                highlightedIndexRef.current = newIndex;
                updateInputValue(newIndex);
                return newIndex;
            });
            return;
        }

        if (e.key === 'ArrowUp') {
            setHighlightedIndex((prevIndex) => {
                const newIndex = prevIndex === null || prevIndex === 0 ? currentItems.length - 1 : prevIndex - 1;
                highlightedIndexRef.current = newIndex;
                updateInputValue(newIndex);
                return newIndex;
            });
            return;
        }
    }, [commitSelection, getCurrentSuggestions, updateInputValue]);

    const handleOptionPointer = useCallback((index: number) => {
        if (loadingRef.current || errorRef.current) return;
        const { currentItems, currentRaw } = getCurrentSuggestions();
        const item = currentItems[index];
        if (!item) return;
        commitSelection(item, currentRaw[index]);
    }, [commitSelection, getCurrentSuggestions]);

    const handleFocus = useCallback(() => {
        if (innerRef.current && innerRef.current.value === lastQueryRef.current && lastSuggestionsRef.current.length > 0) {
            setChoosing(true);
            setItems(lastSuggestionsRef.current);
            setRawItems(lastRawSuggestionsRef.current);
            setHighlightedIndex(null);
            highlightedIndexRef.current = null;
        }
    }, []);

    const shouldShowDropdown = useMemo(() => {
        if (!choosing) return false;
        if (loading) return true;
        if (error) return true;
        if (items.length > 0) return true;
        if (lastSuggestions.length > 0) return true;
        if (lastQuery) return true;
        return false;
    }, [choosing, loading, error, items.length, lastSuggestions.length, lastQuery]);

    const trigger = useMemo(() => (
        <Box
            ref={_container}
            style={style}
            className={`--autocomplete --autocomplete-anchor --${pops.size || themeVariant || Variant.Medium} flex aic rel ${autoCompleteStyle}`.trim()}
        >
            <Input
                {...pops}
                ref={innerRef}
                autoComplete="off"
                onChange={debounce}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus} />

            <Box className={`--arrow rel flex aic jcc`}>
                {loading ? (
                    <span className="--spinner">⏳</span>
                ) : shouldShowDropdown ? (
                    SVGIcons.arrowUp
                ) : (
                    SVGIcons.arrowDown
                )}
            </Box>
        </Box>
    ), [style, pops, autoCompleteStyle, themeVariant, loading, shouldShowDropdown, debounce, handleKeyDown, handleFocus]);

    const { root, canUseDocument, floatingRef, floatingStyle, isPositioned, anchorRef } = useAnchor(trigger, '--autocomplete-anchor', {
        preferredPlacement: 'bottom',
        margin: 2,
        open: choosing,
    });

    // Build suggestion list items
    const suggestionItems = useMemo(() => {
        if (loading) {
            return [{
                label: loadingPlaceholder,
                onClick: () => {},
                className: '--loading',
            }];
        }

        if (error) {
            return [{
                label: `Error: ${error}`,
                onClick: () => {},
                className: '--error',
            }];
        }

        const currentItems = items.length > 0 ? items : lastSuggestions;
        const currentRaw = rawItems.length > 0 ? rawItems : lastRawSuggestions;

        if (currentItems.length === 0 && lastQuery) {
            return [{
                label: emptyPlaceholder,
                onClick: () => {},
                className: '--empty',
            }];
        }

        return currentItems.map((item, index) => ({
            label: renderOption ? renderOption(item, index, currentRaw[index]) : item,
            className: highlightedIndex === index ? '--current' : '',
            animate: {
                transition: TRANSITIONS.SlideInBottom,
                curve: TRANSITION_CURVES.EaseInOut,
                delay: clamp(0.02 * index, 0.02, 0.5)
            }
        }));
    }, [items, rawItems, loading, error, highlightedIndex, lastQuery, lastSuggestions, lastRawSuggestions, loadingPlaceholder, emptyPlaceholder, renderOption]);

    useEffect(() => {
        if (choosing) committingRef.current = false;
    }, [choosing]);

    useEffect(() => {
        if (!choosing) return;

        const handleOutsidePointerDown = (e: MouseEvent) => {
            const target = e.target as Node | null;
            if (!target) return;
            const el = target instanceof Element ? target : target.parentElement;
            const clickedInsideTrigger = Boolean(
                _container.current?.contains(target) ||
                anchorRef.current?.contains(target)
            );
            const clickedInsidePop = Boolean(
                _pop.current?.contains(target) ||
                el?.closest(`.--autocomplete-options`)
            );
            if (!clickedInsideTrigger && !clickedInsidePop) {
                setChoosing(false);
                setHighlightedIndex(null);
                highlightedIndexRef.current = null;
            }
        };

        document.addEventListener("mousedown", handleOutsidePointerDown, true);

        return () => {
            document.removeEventListener("mousedown", handleOutsidePointerDown, true);
        };
    }, [choosing, anchorRef]);

    useEffect(() => {
        const onSelectOpen = (e: Event) => {
            const detail = (e as CustomEvent<{ id?: string }>).detail;
            if (!detail?.id) return;
            if (detail.id === _id) return;
            setChoosing(false);
        };

        document.addEventListener(SELECT_OPEN_EVENT, onSelectOpen as EventListener);
        return () => {
            document.removeEventListener(SELECT_OPEN_EVENT, onSelectOpen as EventListener);
        };
    }, [_id]);

    useEffect(() => {
        if (!choosing) return;
        document.dispatchEvent(new CustomEvent(SELECT_OPEN_EVENT, { detail: { id: _id } }));
    }, [choosing, _id]);

    // Options list (portal)
    const optionsList = (
        <Box
            id={_id}
            className={`--autocomplete-options --suggestion-list --${pops.size || themeVariant || Variant.Medium} --allow-scroll flex cols fixed zIndex:var(--max-z-index)`}
            aria-hidden={!choosing}
            style={{
                ...floatingStyle,
                visibility: shouldShowDropdown && isPositioned ? "visible" : "hidden",
                pointerEvents: shouldShowDropdown && isPositioned ? "auto" : "none",
                minWidth: "anchor-size(width)",
                maxHeight: maxHeight || 'auto',
            }}
            ref={(node) => {
                _pop.current = node;
                floatingRef.current = node;
            }}
            fx={{
                from: { y: 5, opacity: 0 },
                to: { y: 0, opacity: 1 },
                when: shouldShowDropdown && isPositioned,
                duration: 0.05
            }}
            onMouseDown={(e) => {
                if (e.button !== 0) return;
                const target = e.target as HTMLElement | null;
                if (!target) return;
                const li = target.closest(`li`);
                if (!li || !e.currentTarget.contains(li)) return;
                if (
                    li.classList.contains(`--loading`) ||
                    li.classList.contains(`--error`) ||
                    li.classList.contains(`--empty`) ||
                    li.classList.contains(`--list-empty`)
                ) return;

                e.preventDefault();
                e.stopPropagation();

                const listItems = Array.from(li.parentElement?.children ?? []).filter(
                    (node): node is HTMLElement => node instanceof HTMLElement && node.tagName === `LI` && !node.classList.contains(`--list-seperator`)
                );
                const index = listItems.indexOf(li);
                handleOptionPointer(index);
            }}
        >
            <List
                id={_id}
                ref={suggestionRef}
                className={`--options-content flex cols`}
                items={suggestionItems}
                onItemClick={(_item, index, e) => {
                    e?.preventDefault?.();
                    e?.stopPropagation?.();
                    handleOptionPointer(index);
                }}
            />
        </Box>
    );

    return (
        <>
            {root}
            {canUseDocument ? createPortal(optionsList, document.body) : null}
        </>
    )
})

AutoComplete.displayName = `Zuz.AutoComplete`

export default AutoComplete
