"use client"
import { ChangeEvent, Ref, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useBase, usePosition } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { POSITION } from "../../types";
import Box from "../Box";
import Button from "../Button";
import { ButtonProps } from "../Button/types";
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
        onChange,
        ...pops } = props
    const [ value, setValue ] = useState<Option>(
        selected ? 
            typeof selected === `string` ? options.find(fo => fo.value === selected)! : selected
            : options[0]
    )
    const [ choosing, setChoosing ] = useState(false)
    const [ query, setQuery ] = useState<string | null>(null)
    const _ref = useRef<HTMLButtonElement>(null);
    const _search = useRef<HTMLInputElement>(null);
    const _pop = useRef<HTMLDivElement>(null);
    const _did = useId()
    const _id = useMemo(() => name || _did, [])
    const { reposition } = usePosition(_pop as any, { direction: POSITION.Bottom, offset: 2 })
    const { variant: themeVariant } = useTheme(true)!

    const {
        className,
        style,
        rest
    } = useBase(pops)

    const updateValue = (o: Option) => {
        setValue(o)
        setChoosing(false)
        onChange && onChange(o)
    }
    
    useImperativeHandle(ref, () => ({
        setSelected: ( option: Option | string ) => {
            if ( typeof option === `string` ){
                const foundOption = options.find( o => o.value === option )
                if ( foundOption ){
                    setValue( foundOption )
                }
            }
            else{
                setValue( option )
            }
        },
        getValue: () => value || null
    }))

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

    return <Box className={`--select --${variant || themeVariant} ${name ? `--${name}` : ``} rel`.trim()} name={_id}>

        <Button
            ref={_ref}
            data-value={value ? `string` == typeof value ? value : value.value : value || `-1`}
            className={`--selected flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                setChoosing(prev => !prev)
            }}
            {...rest as ButtonProps}>
            <Text className={`--label`}>{value ? `string` == typeof value ? value : value.label : label || `Choose`}</Text>
            <Box className={`--svg-arrow rel flex aic jcc`}>{choosing ? 
                `string` === typeof arrowUpIcon ? <Icon name={arrowUpIcon} as={`--search-action`} /> : arrowUpIcon : 
                `string` === typeof arrowDownIcon ? <Icon name={arrowDownIcon} as={`--search-action`} /> : arrowDownIcon}</Box>
        </Button>

        <Box
            id={_id}           
            className={`--options-list flex cols abs`}
            aria-hidden={!choosing}
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
                (query == null ? options : options.filter((o: Option) => {
                // return 
                    // `string` == typeof o ? 
                    // o.toLowerCase().includes(query.toLowerCase()) 
                    // : 
                    return o.label.toLowerCase().includes(query.toLowerCase()) || o.value.toLowerCase().includes(query.toLowerCase())
                }))
                .map((o) => <OptionItem 
                    updateValue={updateValue} 
                    value={value}
                    key={`option-${(`string` == typeof o ? o : o.label).replace(/\s+/g, `-`)}-${`string` == typeof o ? o : o.value}`}               
                    o={o} />)
            }
        </Box>

    </Box>
}

Select.displayName = `Zuz.Select`

export default Select