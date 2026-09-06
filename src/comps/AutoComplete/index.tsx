"use client"
import { _, clamp, uuid, withPost, withGet, dynamic } from "@zuzjs/core";
import { useDebounce } from "@zuzjs/hooks";
import { forwardRef, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import useBase from "../../hooks/useBase";
import { Props } from "../../types";
import { TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import List from "../List";
import { ListHandler } from "../List/types";
import SVGIcons from "../svgicons";
import { AutoCompleteProps } from "./types";

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
 * // Dynamic object array
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
 * @param dataKey - Field to extract from objects (default: 'name')
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
        dataKey = 'name',
        dynamic: dynamicConfig,
        withStyle,
        onSelect,
        onChange,
        renderOption,
        loadingPlaceholder = 'Loading...',
        emptyPlaceholder = 'No results found',
        ...pops
    } = props

    const { className: autoCompleteStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
    const { style } = useBase(pops)

    const [choosing, setChoosing] = useState(false)
    const [items, setItems] = useState<string[]>([])
    const [rawItems, setRawItems] = useState<dynamic[]>([]) // Store original objects
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const innerRef = useRef<HTMLInputElement>(null)
    const autoRef = useRef<HTMLDivElement>(null)
    const suggestionRef = useRef<ListHandler>(null)

    const _id = useMemo(() => pops.name || uuid(12), [])
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [lastQuery, setLastQuery] = useState<string | null>(null);
    const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);
    const [lastRawSuggestions, setLastRawSuggestions] = useState<dynamic[]>([]);

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

    /**
     * Extract string value from item (string or object)
     */
    const extractValue = (item: string | dynamic): string => {
        return typeof item === 'string' ? item : (item[dataKey] || item.name || String(item));
    };

    /**
     * Filter static data based on input value
     */
    const filterStaticData = (query: string): { filtered: string[], raw: dynamic[] } => {
        if (!data || !Array.isArray(data)) return { filtered: [], raw: [] };

        const lowerQuery = query.toLowerCase();
        const matches: { filtered: string[], raw: dynamic[] } = { filtered: [], raw: [] };

        data.forEach((item) => {
            const value = extractValue(item);
            if (value.toLowerCase().includes(lowerQuery)) {
                matches.filtered.push(value);
                matches.raw.push(typeof item === 'string' ? { [dataKey]: item } : item);
            }
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
                // Check if suggestions are strings or objects
                const processed: { items: string[], raw: dynamic[] } = { items: [], raw: [] };

                suggestions.forEach((item: string | dynamic) => {
                    const value = extractValue(item);
                    processed.items.push(value);
                    processed.raw.push(typeof item === 'string' ? { [dataKey]: item } : item);
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
        }
    }

    const debounce = useDebounce(handleChange, debounceMs)

    const handlePosition = () => {
        if (autoRef.current) {
            const boundingBox = autoRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - boundingBox.bottom;
            const spaceAbove = boundingBox.top;

            if (suggestionRef.current?.element) {
                const suggestionList = suggestionRef.current.element;
                if (spaceBelow < suggestionList.offsetHeight && spaceAbove > spaceBelow) {
                    suggestionList.style.top = 'auto';
                    suggestionList.style.bottom = `${boundingBox.height}px`;
                    suggestionList.style.maxHeight = `${spaceAbove - 150}px`;
                } else {
                    suggestionList.style.top = `${boundingBox.height + 5}px`;
                    suggestionList.style.bottom = 'auto';
                    suggestionList.style.maxHeight = `${spaceBelow - 150}px`;
                }
            }
        }
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (items.length > 0) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.key === 'Escape') {
                setHighlightedIndex(null);
                setChoosing(false);
                setItems([]);
                setRawItems([]);
            }
            else if (e.key === 'ArrowDown') {
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex === null || prevIndex === items.length - 1 ? 0 : prevIndex + 1;
                    updateInputValue(newIndex);
                    return newIndex;
                });
            } else if (e.key === 'ArrowUp') {
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex === null || prevIndex === 0 ? items.length - 1 : prevIndex - 1;
                    updateInputValue(newIndex);
                    return newIndex;
                });
            } else if (e.key === 'Enter' && highlightedIndex !== null) {
                const selectedItem = items[highlightedIndex];
                const selectedRaw = rawItems[highlightedIndex];
                if (innerRef.current) {
                    innerRef.current.value = selectedItem;
                    setChoosing(false);
                    setItems([]);
                    setRawItems([]);
                    onSelect?.(selectedItem, selectedRaw);
                }
            }
        }
    };

    const handleMouseSelect = (item: string, rawItem: dynamic) => {
        if (innerRef.current) {
            innerRef.current.value = item;
            setChoosing(false);
            setItems([]);
            setRawItems([]);
            onSelect?.(item, rawItem);
        }
    };

    const updateInputValue = (index: number) => {
        const selectedItem = items[index];
        if (selectedItem && innerRef.current) {
            innerRef.current.value = selectedItem;
            // Move cursor to the end of the input value
            innerRef.current.setSelectionRange(selectedItem.length, selectedItem.length);
        }
        // Auto-scroll the suggestion list to the selected index
        if (suggestionRef.current?.element) {
            const suggestionList = suggestionRef.current.element;
            const selectedItemElement = suggestionList.children[index] as HTMLElement;
            if (selectedItemElement) {
                selectedItemElement.scrollIntoView({ block: 'nearest' });
            }
        }
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (autoRef.current && !autoRef.current.contains(event.target as Node)) {
            setChoosing(false);
            setItems([]);
            setRawItems([]);
        }
    };

    const handleFocus = () => {
        if (innerRef.current && innerRef.current.value === lastQuery) {
            setItems(lastSuggestions);
            setRawItems(lastRawSuggestions);
            setHighlightedIndex(null);
            handlePosition();
        }
    };

    useEffect(() => {
        window.addEventListener('resize', handlePosition);
        window.addEventListener('scroll', handlePosition, true);
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('resize', handlePosition);
            window.removeEventListener('scroll', handlePosition, true);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [])

    useEffect(() => {
        handlePosition()
    }, [items])

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

        if (items.length === 0 && lastQuery) {
            return [{
                label: emptyPlaceholder,
                onClick: () => {},
                className: '--empty',
            }];
        }

        return items.map((item, index) => ({
            label: renderOption ? renderOption(item, index, rawItems[index]) : item,
            onClick: (e: any) => {
                e.preventDefault();
                e.stopPropagation();
                handleMouseSelect(item, rawItems[index]);
            },
            className: highlightedIndex === index ? '--current' : '',
            animate: {
                transition: TRANSITIONS.SlideInBottom,
                curve: TRANSITION_CURVES.EaseInOut,
                delay: clamp(0.02 * index, 0.02, 0.5)
            }
        }));
    }, [items, rawItems, loading, error, highlightedIndex, lastQuery, loadingPlaceholder, emptyPlaceholder]);

    return <Box
        style={style}
        ref={autoRef}
        className={`--autocomplete --${props.size || Variant.Small} flex aic rel ${autoCompleteStyle}`.trim()}>

        <Input
            ref={innerRef}
            autoComplete="off"
            onChange={debounce}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            {...pops} />

        <Box className={`--arrow rel flex aic jcc`}>
            {loading ? (
                <span className="--spinner">⏳</span>
            ) : items.length > 0 ? (
                SVGIcons.arrowUp
            ) : (
                SVGIcons.arrowDown
            )}
        </Box>

        { (items.length > 0 || loading || (error !== null) || (lastQuery && items.length === 0)) &&
            <List
                id={_id}
                ref={suggestionRef}
                className={`--suggestion-list flex cols abs`}
                items={suggestionItems}
            />
        }
    </Box>
})

AutoComplete.displayName = `Zuz.AutoComplete`

export default AutoComplete
