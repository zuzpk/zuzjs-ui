import { forwardRef, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { AutoCompleteProps } from "./types";
import { useBase, useDebounce } from "../../hooks";
import { Props } from "../../types";
import Box from "../Box";
import { Size, TRANSITION_CURVES, TRANSITIONS } from "../../types/enums";
import Input from "../Input";
import SVGIcons from "../svgicons";
import { clamp, isArray, isUrl, uuid, withPost } from "../../funs";
import List from "../List";

const AutoComplete = forwardRef<HTMLDivElement, AutoCompleteProps>((props, ref) => {

    const { animate, action, data, withStyle, onChange, ...pops } = props
    const { className : autoCompleteStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
    const { style } = useBase(pops)
    const [ choosing, setChoosing ] = useState(false)
    const [ items, setItems ] = useState<string[]>(data || [])
    const innerRef = useRef<HTMLInputElement>(null)
    const autoRef = useRef<HTMLDivElement>(null)
    const suggestionRef = useRef<HTMLUListElement | HTMLOListElement>(null)
    const _id = useMemo(() => pops.name || uuid(), [])
    const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
    const [lastQuery, setLastQuery] = useState<string | null>(null);
    const [lastSuggestions, setLastSuggestions] = useState<string[]>([]);
    

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if ( e.target.value == ``) {
            setChoosing(false);
            setItems([]);
        }
        else if ( action && e.target.value.trim() != `` ){
            withPost(action, { query: e.target.value })
            .then((resp) => {
                if ( `items` in resp && isArray(resp.items) ){
                    setItems(resp.items)
                    setLastQuery(e.target.value)
                    setLastSuggestions(resp.items)                    
                }
                else{
                    console.error(`Action Response should contain items array`)
                }
                setHighlightedIndex(null);
            })
            .catch((err) => {
                setHighlightedIndex(null);
                setItems([])
            })
        }
    }

    const debounce = useDebounce(handleChange, 250)

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
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault();e.stopPropagation(); }
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
            } else if (e.key === 'ArrowUp') {
                setHighlightedIndex((prevIndex) => {
                    const newIndex = prevIndex === null || prevIndex === 0 ? items.length - 1 : prevIndex - 1;
                    updateInputValue(newIndex);
                    return newIndex;
                });
            } else if (e.key === 'Enter' && highlightedIndex !== null) {
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

    const handleMouseSelect = (item: string) => {
        if (innerRef.current) {
            innerRef.current.value = item;
            setChoosing(false);
            setItems([]);
            // if (onChange) {
            //     onChange(item);
            // }
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
        if (suggestionRef.current) {
            const suggestionList = suggestionRef.current;
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

    }, [])

    useEffect(() => {
        handlePosition()
    }, [items])

    
 
    return <Box
        style={style}
        ref={autoRef}
        className={`--autocomplete --${props.size || Size.Small} flex aic rel ${autoCompleteStyle}`.trim()}>

        <Input
            ref={innerRef}
            autoComplete="off"
            onChange={debounce}
            onKeyDown={handleKeyDown}
            onFocus={handleFocus}
            {...pops} />

        <Box className={`--arrow rel flex aic jcc`}>{items.length > 0 ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box>

        { items.length > 0 && <List
            id={_id}    
            ref={suggestionRef}       
            className={`--suggestion-list flex cols abs`}
            items={items.map((item, index) => ({
                label: item,
                onClick: (e: any) => {
                    e.preventDefault(); e.stopPropagation();
                    handleMouseSelect(item)
                },
                className: highlightedIndex === index ? '--current' : '',
                animate: {
                    transition: TRANSITIONS.SlideInBottom,
                    curve: TRANSITION_CURVES.EaseInOut,
                    delay: clamp(0.02 * index, 0.02, 0.5)
                }
            }))}
            />}
    </Box>


})

export default AutoComplete