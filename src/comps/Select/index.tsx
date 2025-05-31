"use client"
import { ChangeEvent, forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import { ButtonProps } from "../Button/types";
import Input from "../Input";
import SVGIcons from "../svgicons";
import Text from "../Text";
import OptionItem from "./optionItem";
import { Option, SelectProps } from "./types";

const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {

    const { 
        selected, 
        options, 
        label,
        name,
        variant,
        search: withSearch,
        searchPlaceholder,
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
    const _did = useId()
    const _id = useMemo(() => name || _did, [])

    const {
        className,
        style,
        rest
    } = useBase(pops)

    const updateValue = (o: Option) => {
        setValue(o)
        onChange && onChange(o)
    }

    useEffect(() => {
        document.body.addEventListener(`click`, (e: MouseEvent) => {
            setChoosing(false)
        })
    }, [])

    useEffect(() => {
        if ( choosing ){
            _search.current && _search.current.focus()
        }
        else{
            if ( _search.current ){
                _search.current.value = ``
            }
            setQuery(null)
        }
    }, [choosing])

    return <Box className={`--select ${variant ? `--${variant}` : ``} ${name ? `--${name}` : ``} rel`.trim()} name={_id}>

        <Button
            data-value={value ? `string` == typeof value ? value : value.value : value || `-1`}
            className={`--selected flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => setChoosing(prev => !prev)}
            {...rest as ButtonProps}>
            <Text className={`--label`}>{value ? `string` == typeof value ? value : value.label : label || `Choose`}</Text>
            <Box className={`--svg-arrow rel flex aic jcc`}>{choosing ? SVGIcons.arrowUp : SVGIcons.arrowDown}</Box>
        </Button>

        <Box
            id={_id}           
            className={`--options-list flex cols abs`}
            style={{
                pointerEvents: choosing ? `auto` : `none`,
            }}
            animate={{
                from: { y: 5, opacity: 0 },
                to: { y: 0, opacity: 1 },
                when: choosing,
                duration: .05
            }}>
            {withSearch && <Input 
                ref={_search}
                onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    setQuery(e.target.value == `` ? null : e.target.value)
                }}
                className={`--select-search`}
                placeholder={searchPlaceholder || `Search...`} />}
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
})

Select.displayName = `Zuz.Select`

export default Select