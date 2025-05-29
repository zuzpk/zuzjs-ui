"use client"
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import { Variant } from '../../types/enums';
import Box from '../Box';
import Button from '../Button';
import Input from '../Input';
import KeyBoardKeys from '../KeyboardKeys';
import SVGIcons from '../svgicons';
import { SearchHandler, SearchProps } from './types';

const Search = forwardRef<SearchHandler, SearchProps>((props, ref) => {

    const { fx, animate, withStyle, as, reverse, onChange, ...pops } = props
    const { style, className } = useBase({ as: props.as })
    // const { className : searchStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
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

    useImperativeHandle(ref, () => ({
        focus: () => innerRef.current?.focus()
    }))

    useEffect(() => {}, [])
 
    return <Box 
        style={style}
        className={`--search ${reverse ? `--search-rev` : ``} --${props.variant || Variant.Small} flex aic ${props.as?.includes(`abs`) ? `` : `rel`} ${className}`.trim()}>
        { reverse && <Button 
            tabIndex={-1}
            onClick={e => handleSubmit()}
            className={`--send flex aic jcc`}
            variant={props.variant || Variant.Small}>
            {query !== `` ? SVGIcons.close : SVGIcons.search}
        </Button> }
        <Input 
            ref={innerRef}
            onChange={handleChange}
            className={`--${props.variant || Variant.Small}`}
            {...pops} />
        {props.shortcut && <KeyBoardKeys keys={props.shortcut} as={`abs`} />}
        { !reverse && <Button 
            tabIndex={-1}
            onClick={e => handleSubmit()}
            className={`--send flex aic jcc`}
            variant={props.variant || Variant.Small}>
            {query !== `` ? SVGIcons.close : SVGIcons.search}
        </Button> }
    </Box>
        
})

Search.displayName = `Zuz.Search`

export default Search