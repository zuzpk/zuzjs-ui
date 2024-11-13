import { ChangeEvent, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { dynamicObject } from "../../types";
import { FORMVALIDATION } from "../../types/enums";
import SVGIcons from "../svgicons";
import { uuid } from "../../funs";
import Box, { BoxProps } from "../Box";
import { useBase } from "../../hooks";
import Button, { ButtonProps } from "../Button";
import Text, { TextProps } from "../Text";
import { animationProps } from "../../types/interfaces";
import Input, { InputProps } from "../Input";
import { Option, SelectProps } from "./types";
import OptionItem from "./optionItem";

const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => {

    const { 
        selected, 
        options, 
        label,
        name,
        search: withSearch,
        searchPlaceholder,
        onChange,
        ...pops } = props
    const [ value, setValue ] = useState<Option>(selected || options[0])
    const [ choosing, setChoosing ] = useState(false)
    const [ query, setQuery ] = useState<string | null>(null)
    const _ref = useRef<HTMLButtonElement>(null);
    const _search = useRef<HTMLInputElement>(null);
    const _id = useMemo(() => name || uuid(), [])

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

    return <Box className={`--select rel`}>

        <Button
            data-value={value ? `string` == typeof value ? value : value.value : value || `-1`}
            ref={_ref} 
            className={`--selected flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => setChoosing(true)}
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
                return `string` == typeof o ? 
                    o.toLowerCase().includes(query.toLowerCase()) 
                    : o.label.toLowerCase().includes(query.toLowerCase()) || o.value.toLowerCase().includes(query.toLowerCase())
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

export default Select