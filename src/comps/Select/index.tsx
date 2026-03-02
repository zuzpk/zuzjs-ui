"use client"
import { _ } from "@zuzjs/core";
import { ChangeEvent, Ref, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useBase, usePosition } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { POSITION } from "../../types";
import Box from "../Box";
import Button from "../Button";
import { ButtonProps } from "../Button/types";
import Flex from "../Flex";
import Icon from "../Icon";
import Input from "../Input";
import SVGIcons from "../svgicons";
import Text from "../Text";
import OptionItem from "./optionItem";
import { Option, SelectHandler, SelectProps } from "./types";

// const Select = forwardRef<SelectHandler, SelectProps>((props, ref) => {
const Select = ({
    ref,
    ...props
} : SelectProps & {
    ref?: Ref<SelectHandler>
}) => {

    const { 
        selected, 
        options, 
        label,
        name,
        variant,
        search: withSearch,
        searchPlaceholder,
        maxHeight,
        arrowDownIcon = SVGIcons.arrowDown,
        arrowUpIcon = SVGIcons.arrowUp,
        expanded,
        multiple,
        tokenizer,
        wrapTokens,
        disabled,
        checkIcon,
        closeIcon,
        onChange,
        ...pops } = props

    const [ value, setValue ] = useState<Option | Option[]>(() => {
        if (multiple || tokenizer) {
            if (!selected) return [];
            const arr = Array.isArray(selected) ? selected : [selected];
            return arr.map(item => 
                typeof item === 'string' ? options.find(o => o.value === item)! : item
            ) as Option[];
        }
        return selected ? (typeof selected === 'string' ? options.find(o => o.value === selected)! : selected) : options[0];
    })

    const [ choosing, setChoosing ] = useState(false)
    const [ query, setQuery ] = useState<string | null>(null)
    const _ref = useRef<HTMLButtonElement>(null);
    const _search = useRef<HTMLInputElement>(null);
    const _pop = useRef<HTMLDivElement>(null);
    const _did = useId()
    const _id = useMemo(() => name || _did, [])
    const { reposition } = usePosition(_pop as any, { direction: POSITION.Bottom, offset: 2 })
    const { variant: themeVariant } = useTheme(true)!
    
    const crossIcon = closeIcon ? 
        typeof closeIcon === `string` ? <Icon name={closeIcon} /> 
            : closeIcon
                : SVGIcons.close;

    const {
        className,
        style,
        rest
    } = useBase(pops, undefined)

    const isSelected = (o: Option) => {
        if (Array.isArray(value)) return value.some(v => v.value === o.value);
        return value?.value === o.value;
    };

    const updateValue = (o: Option) => {

        if (disabled || o.disabled) return;

        if (multiple || tokenizer) {
            const current = Array.isArray(value) ? value : [];
            const exists = current.find(v => v.value === o.value);
            const nextValue = exists 
                ? current.filter(v => v.value !== o.value)
                : [...current, o];
            
            setValue(nextValue);
            // setChoosing(false)
            onChange?.(nextValue as any);
        } else {
            setValue(o)
            setChoosing(false)
            onChange?.(o)
        }
    }
    
    const removeToken = (e: React.MouseEvent, o: Option) => {
        e.stopPropagation();
        if (disabled) return;
        const nextValue = (value as Option[]).filter(v => v.value !== o.value);
        setValue(nextValue);
        setChoosing(false)
        onChange?.(nextValue as any);
    };

    const handleListWheel = (e: React.WheelEvent) => {
        const el = e.currentTarget;
        const isAtTop = el.scrollTop === 0 && e.deltaY < 0;
        const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight && e.deltaY > 0;

        // If we are scrolling inside the list and not at the boundaries,
        // kill the event so ScrollView never sees it.
        if (!isAtTop && !isAtBottom) {
            e.stopPropagation();
        } else {
            // If we hit the boundary, still stop it to prevent ScrollView from moving
            e.preventDefault(); 
            e.stopPropagation();
        }
    };

    useImperativeHandle(ref, () => ({
        setSelected: (option: Option | string | Option[] | string[]) => {
            // Handle Array Input (Multi/Tokenizer)
            if (Array.isArray(option)) {
                const nextOptions = option.map(item => 
                    typeof item === 'string' ? options.find(o => o.value === item)! : item
                ).filter(Boolean);
                setValue(nextOptions as Option[]);
            } 
            // Handle Single Input
            else if (typeof option === 'string') {
                const found = options.find(o => o.value === option);
                if (found) setValue(found);
            } 
            else {
                setValue(option as Option);
            }
        },
        // Explicitly cast to satisfy the handler interface
        getValue: () => (value || null) as (Option | Option[] | null)
    }), [value, options])

    useEffect(() => {
        if (!choosing) return;

        const handleScroll = () => {
            reposition(); // Re-calculate top/left while scrolling
        };

        // Attach to the window AND use capture to catch nested scrolls
        window.addEventListener("scroll", handleScroll, true);
        window.addEventListener("resize", reposition);
        
        return () => {
            window.removeEventListener("scroll", reposition, true);
            window.removeEventListener("resize", reposition);
        };
    }, [choosing, reposition]);

    useEffect(() => {
        if (!choosing) {
            // Cleanup: Clear search when closed
            if (_search.current) _search.current.value = "";
            setQuery(null);
            return;
        }

        // 1. Focus search & Position menu
        _search.current?.focus();
        reposition();

        // 2. Handle clicking outside to close
        const handleOutsideClick = (e: MouseEvent) => {
            // If click is outside the select component, close it
            if (_pop.current && !_pop.current.contains(e.target as Node)) {
                setChoosing(false);
            }
        };

        // Use a tiny delay so the "Open" click doesn't immediately trigger "Close"
        const timeout = setTimeout(() => {
            document.addEventListener("click", handleOutsideClick);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener("click", handleOutsideClick);
        };
    }, [choosing, reposition]);

    const _currentOption = useMemo(() =>  _(value).isArray() ? 
            (value as Option[]).length > 0 ? (value as Option[])[0] : undefined
                : value as Option, [value])

    

    return <Box className={`--select ${expanded == true ? `--expanded` : ``} --${variant || themeVariant} ${name ? `--${name}` : ``} ${disabled ? '--disabled' : ''} rel`.trim()} name={_id}>

        <Button
            ref={_ref}
            disabled={disabled}
            data-value={_currentOption?.value ?? `-1`}
            className={`--select-display --selected flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                if ( !disabled ) setChoosing(prev => !prev)
            }}
            {...rest as ButtonProps}>
            { _currentOption?.icon && <Icon as={`--selected-icon`} name={_currentOption.icon} /> }
            <Flex aic as="--label-wrapper">
                {tokenizer && Array.isArray(value) && value.length > 0 ? (
                    <Flex as={`--tokens-wrap${wrapTokens === true ? ` --wrap` : ``}`}>
                        {value.map(v => (
                            <Flex key={v.value} aic as="--token">
                                <Text as={`--token-label`}>{v.label}</Text>
                                <Box as={`--token-remove`} onClick={(e) => removeToken(e, v)}>
                                    {crossIcon}
                                </Box>
                            </Flex>
                        ))}
                        {value.length < options.length && <Text as="--label">
                            {label || 'Choose'}
                        </Text>}
                    </Flex>
                    ) : (
                        <Text as="--label">
                            {Array.isArray(value) 
                                ? (value.length > 0 ? `${value.length} selected` : label || 'Choose')
                                : (value?.label || label || 'Choose')}
                        </Text>
                    )}
            </Flex>

            <Box className={`--svg-arrow rel flex aic jcc`}>{choosing ? 
                `string` === typeof arrowUpIcon ? <Icon name={arrowUpIcon} as={`--search-action`} /> : arrowUpIcon : 
                `string` === typeof arrowDownIcon ? <Icon name={arrowDownIcon} as={`--search-action`} /> : arrowDownIcon}</Box>
                
        </Button>

        <Box
            id={_id}           
            className={`--options-list --allow-scroll -fx flex cols abs zIndex:var(--max-z-index)`}
            aria-hidden={!choosing}
            onWheel={handleListWheel}
            style={{
                maxHeight: maxHeight || `auto`
            }}
            ref={_pop}
            fx={{
                from: { y: 5, opacity: 0 },
                to: { y: 0, opacity: 1 },
                when: choosing,
                duration: .05
            }}>
            {withSearch && <Box as={`--select-search --sticky`}>
                <Input 
                    ref={_search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setQuery(e.target.value == `` ? null : e.target.value)
                    }}
                    className={`--search-input`}
                    placeholder={searchPlaceholder || `Search...`} />
            </Box>}
            {   
                options
                .filter(o => !query || o.label.toLowerCase().includes(query.toLowerCase()))
                .map((o) => <OptionItem 
                    updateValue={updateValue} 
                    checkIcon={checkIcon}
                    selected={isSelected(o)}
                    key={`option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`}               
                    o={o} />)
            }
        </Box>

    </Box>
}

Select.displayName = `Zuz.Select`

export default Select