"use client"
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
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

/**
 * Search component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Search onChange={(query) => console.log(query)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Search onChange={(query) => console.log(query)} placeholder="Search..." debounceMs={300} onSubmit={(q) => {}} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param placeholder - Placeholder text
 * @param debounceMs - debounceMs prop
 * @param onSubmit - Callback function triggered on form submission
 */
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
        clearOnSubmit = false,
        onChange,
        onClear,
        onSubmit,
        onKeyDown,
        variant,
        shortcut,
        type,
        ...pops
    } = props
    const { style, className } = useBase({ as })
    const [query, setQuery] = useState<string>(``)
    const { variant: themeVariant } = useTheme(true)!
    const innerRef = useRef<HTMLInputElement>(null)

    // Single source of truth for clearing. Resets state + the underlying
    // input, fires onChange(``) so controlled consumers stay in sync, and
    // notifies onClear so consumers can distinguish "cleared" from "changed".
    const clearSearchInput = useCallback(() => {
        setQuery(``)
        onChange?.(``)
        onClear?.()
        if (innerRef.current) {
            innerRef.current.value = ``
        }
    }, [onChange, onClear])

    // Single source of truth for submitting. Both the action button and
    // the Enter key route through this so behavior (trimming, clearOnSubmit,
    // guarding empty queries) can never drift between the two entry points.
    const handleSubmit = useCallback(() => {
        const trimmed = query.trim()
        if (trimmed === ``) return
        onSubmit?.(trimmed)
        if (clearOnSubmit) clearSearchInput()
    }, [query, onSubmit, clearOnSubmit, clearSearchInput])

    const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e)
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
    }, [onKeyDown, handleSubmit])

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value)
        onChange?.(e.target.value)
    }, [onChange])

    // Action button is "clear" when there's a query, "search/submit" when empty.
    const handleActionClick = useCallback(() => {
        if (query !== ``){
            clearSearchInput()
            onClear?.()
        }
        else handleSubmit()
    }, [query, clearSearchInput, handleSubmit])

    useImperativeHandle(ref, () => ({
        focus: () => innerRef.current?.focus(),
        value: () => innerRef.current?.value,
        setValue: (q: string) => {
            if ( innerRef.current ) innerRef.current.value = q
        }
    }), [])

    const actionButton = <Button
        tabIndex={-1}
        onClick={handleActionClick}
        className={`--send flex aic jcc`}
        variant={variant || Variant.Medium}>
        {/* <Box as={`--send-wrap`}> */}
        {query !== `` ?
            !hideClearIcon && (`string` === typeof clearIcon ? <Icon name={clearIcon} as={`--search-action`} /> : clearIcon) :
            !hideSearchIcon && (`string` === typeof searchIcon ? <Icon name={searchIcon} as={`--search-action`} /> : searchIcon)}
        {/* </Box> */}
    </Button>

    return <Box
        style={style}
        className={`--search --${variant || themeVariant || Variant.Medium} flex aic ${typeof as === 'string' && as.includes(`abs`) ? `` : `rel`} ${className}`.trim()}>
        {reverse && actionButton}
        <Input
            ref={innerRef}
            value={query}
            onChange={handleChange}
            {...pops}
            onKeyDown={handleKeyDown}
            variant={props.variant} />
        {shortcut && <KeyBoardKeys keys={shortcut} as={`--abs`} />}
        {!reverse && actionButton}
    </Box>

})

Search.displayName = `Zuz.Search`

export default Search