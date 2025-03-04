"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { clamp, isArray, uuid, withPost } from "../../funs";
import { useBase, useDebounce } from "../../hooks";
import { Size, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import List from "../List";
import SVGIcons from "../svgicons";
const AutoComplete = forwardRef((props, ref) => {
    const { animate, action, data, withStyle, onChange, ...pops } = props;
    const { className: autoCompleteStyle } = useBase({ as: withStyle || `` });
    const { style } = useBase(pops);
    const [choosing, setChoosing] = useState(false);
    const [items, setItems] = useState(data || []);
    const innerRef = useRef(null);
    const autoRef = useRef(null);
    const suggestionRef = useRef(null);
    const _id = useMemo(() => pops.name || uuid(), []);
    const [highlightedIndex, setHighlightedIndex] = useState(null);
    const [lastQuery, setLastQuery] = useState(null);
    const [lastSuggestions, setLastSuggestions] = useState([]);
    const handleChange = (e) => {
        if (e.target.value == ``) {
            setChoosing(false);
            setItems([]);
        }
        else if (action && e.target.value.trim() != ``) {
            withPost(action, { query: e.target.value })
                .then((resp) => {
                if (`items` in resp && isArray(resp.items)) {
                    setItems(resp.items);
                    setLastQuery(e.target.value);
                    setLastSuggestions(resp.items);
                }
                else {
                    console.error(`Action Response should contain items array`);
                }
                setHighlightedIndex(null);
            })
                .catch((err) => {
                setHighlightedIndex(null);
                setItems([]);
            });
        }
    };
    const debounce = useDebounce(handleChange, 250);
    const handlePosition = () => {
        if (autoRef.current) {
            const boundingBox = autoRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - boundingBox.bottom;
            const spaceAbove = boundingBox.top;
            if (suggestionRef.current) {
                const suggestionList = suggestionRef.current;
                if (spaceBelow < suggestionList.offsetHeight && spaceAbove > spaceBelow) {
                    suggestionList.style.top = 'auto';
                    suggestionList.style.bottom = `${boundingBox.height}px`;
                    suggestionList.style.maxHeight = `${spaceAbove - 150}px`;
                }
                else {
                    suggestionList.style.top = `${boundingBox.height + 5}px`;
                    suggestionList.style.bottom = 'auto';
                    suggestionList.style.maxHeight = `${spaceBelow - 150}px`;
                }
            }
        }
    };
    const handleKeyDown = (e) => {
        if (items.length > 0) {
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                e.stopPropagation();
            }
            if (e.key === 'Escape') {
                setHighlightedIndex(null);
                setChoosing(false);
                setItems([]);
            }
            else if (e.key === 'ArrowDown') {
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex === null || prevIndex === items.length - 1 ? 0 : prevIndex + 1;
                    updateInputValue(newIndex);
                    return newIndex;
                });
            }
            else if (e.key === 'ArrowUp') {
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex === null || prevIndex === 0 ? items.length - 1 : prevIndex - 1;
                    updateInputValue(newIndex);
                    return newIndex;
                });
            }
            else if (e.key === 'Enter' && highlightedIndex !== null) {
                const selectedItem = items[highlightedIndex];
                if (innerRef.current) {
                    innerRef.current.value = selectedItem;
                    setChoosing(false);
                    setItems([]);
                    // if (onChange) {
                    //     onChange(selectedItem);
                    // }
                }
            }
        }
    };
    const handleMouseSelect = (item) => {
        if (innerRef.current) {
            innerRef.current.value = item;
            setChoosing(false);
            setItems([]);
            // if (onChange) {
            //     onChange(item);
            // }
        }
    };
    const updateInputValue = (index) => {
        const selectedItem = items[index];
        if (selectedItem && innerRef.current) {
            innerRef.current.value = selectedItem;
            // Move cursor to the end of the input value
            innerRef.current.setSelectionRange(selectedItem.length, selectedItem.length);
        }
        // Auto-scroll the suggestion list to the selected index
        if (suggestionRef.current) {
            const suggestionList = suggestionRef.current;
            const selectedItemElement = suggestionList.children[index];
            if (selectedItemElement) {
                selectedItemElement.scrollIntoView({ block: 'nearest' });
            }
        }
    };
    const handleClickOutside = (event) => {
        if (autoRef.current && !autoRef.current.contains(event.target)) {
            setChoosing(false);
            setItems([]);
        }
    };
    const handleFocus = () => {
        if (innerRef.current && innerRef.current.value === lastQuery) {
            setItems(lastSuggestions);
            setHighlightedIndex(null); // Reset highlighted index
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
    }, []);
    useEffect(() => {
        handlePosition();
    }, [items]);
    return _jsxs(Box, { style: style, ref: autoRef, className: `--autocomplete --${props.size || Size.Small} flex aic rel ${autoCompleteStyle}`.trim(), children: [_jsx(Input, { ref: innerRef, autoComplete: "off", onChange: debounce, onKeyDown: handleKeyDown, onFocus: handleFocus, ...pops }), _jsx(Box, { className: `--arrow rel flex aic jcc`, children: items.length > 0 ? SVGIcons.arrowUp : SVGIcons.arrowDown }), items.length > 0 && _jsx(List, { id: _id, ref: suggestionRef, className: `--suggestion-list flex cols abs`, items: items.map((item, index) => ({
                    label: item,
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleMouseSelect(item);
                    },
                    className: highlightedIndex === index ? '--current' : '',
                    animate: {
                        transition: TRANSITIONS.SlideInBottom,
                        curve: TRANSITION_CURVES.EaseInOut,
                        delay: clamp(0.02 * index, 0.02, 0.5)
                    }
                })) })] });
});
AutoComplete.displayName = `AutoComplete`;
export default AutoComplete;
