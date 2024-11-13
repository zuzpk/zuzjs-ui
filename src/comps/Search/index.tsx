"use client"
import { forwardRef, useEffect, useRef, useState } from 'react';
import { Props } from '../../types';
import { useBase } from '../../hooks';
import Icon, { IconProps } from '../Icon';
import Span, { SpanProps } from '../Span';
import Input, { InputProps } from '../Input';
import Box, { BoxProps } from '../Box';
import Button, { ButtonProps } from '../Button';
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
        className={`--search flex aic rel ${searchStyle}`.trim()}>
        <Input 
            ref={innerRef}
            onChange={handleChange}
            {...pops} />
        <Button 
            tabIndex={-1}
            onClick={e => handleSubmit()}
            className={`--send flex aic jcc abs`}>
            {query !== `` ? SVGIcons.close : SVGIcons.search}
        </Button>
    </Box>
        
})

export default Search