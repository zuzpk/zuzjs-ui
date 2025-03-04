"use client"
import { forwardRef, useEffect, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import { Props } from '../../types';
import { Size } from '../../types/enums';
import Box from '../Box';
import Button from '../Button';
import Input, { InputProps } from '../Input';
import SVGIcons from '../svgicons';

export type SearchProps = InputProps & {
    onSubmit?: (value: string) => void,
    onChange?: (value: string) => void,
    withStyle?: string
}

const Search = forwardRef<HTMLInputElement, SearchProps>((props, ref) => {

    const { animate, withStyle, onChange, ...pops } = props
    const { style } = useBase(pops)
    const { className : searchStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
    const [ query, setQuery ] = useState<string>(``)

    const innerRef = useRef<HTMLInputElement>(null)

    if ( `type` in props ){
        delete props[`type`]
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        onChange?.(e.target.value)
    }

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault()
        if (query.trim()!== ``)  {
            setQuery(``)
            onChange?.(``);
            if ( innerRef.current ){
                innerRef.current.value = ``
            }
        }
        // onSubmit?.(query)
    }

    useEffect(() => {}, [])
 
    return <Box 
        style={style}
        className={`--search --${props.size || Size.Small} flex aic rel ${searchStyle}`.trim()}>
        <Input 
            ref={innerRef}
            onChange={handleChange}
            className={`--${props.size || Size.Small}`}
            {...pops} />
        <Button 
            tabIndex={-1}
            onClick={e => handleSubmit()}
            className={`--send flex aic jcc abs`}
            size={props.size || Size.Small}>
            {query !== `` ? SVGIcons.close : SVGIcons.search}
        </Button>
    </Box>
        
})

Search.displayName = `Search`

export default Search