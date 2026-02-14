"use client"
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { useBase } from '../../hooks';
import { useTheme } from '../../hooks/useColorScheme';
import { Variant } from '../../types/enums';
import Box from '../Box';
import Button from '../Button';
import Icon from '../Icon';
import Input from '../Input';
import KeyBoardKeys from '../KeyboardKeys';
import SVGIcons from '../svgicons';
import { SearchHandler, SearchProps } from './types';

const Search = forwardRef<SearchHandler, SearchProps>((props, ref) => {

    const { 
        fx,
        withStyle, 
        as, 
        reverse = false, 
        searchIcon = SVGIcons.search, 
        hideSearchIcon = false,
        clearIcon = SVGIcons.close, 
        hideClearIcon = false,
        onChange, onClear, ...pops 
    } = props
    const { style, className } = useBase({ as: props.as })
    // const { className : searchStyle } = useBase({ as: withStyle || `` } as Props<`div`>)
    const [ query, setQuery ] = useState<string>(``)
    const { variant: themeVariant } = useTheme(true)!
    const innerRef = useRef<HTMLInputElement>(null)

    const actionBtn = useMemo(() => <Button
        tabIndex={-1}
        onClick={e => handleSubmit()}
        className={`--send flex aic jcc`}
        variant={props.variant || Variant.Small}>
        {query !== `` ? 
            !hideClearIcon && (`string` === typeof clearIcon ? <Icon name={clearIcon} as={`--search-action`} /> : clearIcon) : 
            !hideSearchIcon && (`string` === typeof searchIcon ? <Icon name={searchIcon} as={`--search-action`} /> : searchIcon )}</Button>, 
            [reverse, searchIcon, hideClearIcon, clearIcon, hideSearchIcon])

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
                props.onConfirm?.(``)
            }
        }
        // onSubmit?.(query)
    }

    useImperativeHandle(ref, () => ({
        focus: () => innerRef.current?.focus(),
        value: () => innerRef.current?.value
    }))

    useEffect(() => {}, [])
 
    return <Box 
        style={style}
        className={`--search ${reverse ? `--search-rev` : ``} --${props.variant || themeVariant || Variant.Medium} flex aic ${typeof props.as === 'string' && props.as.includes(`abs`) ? `` : `rel`} ${className}`.trim()}>
        { reverse && actionBtn }
        <Input 
            ref={innerRef}
            onChange={handleChange}
            {...pops} />
        {props.shortcut && <KeyBoardKeys keys={props.shortcut} as={`abs`} />}
        { !reverse && actionBtn }
    </Box>
        
})

Search.displayName = `Zuz.Search`

export default Search