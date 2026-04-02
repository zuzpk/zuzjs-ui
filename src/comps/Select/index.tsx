"use client"
import { useDebounce } from "@zuzjs/hooks";
import { ChangeEvent, ReactElement, Ref, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useBase, usePosition } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { POSITION, Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import { useForm } from "../Form/context";
import Icon from "../Icon";
import Search from "../Search";
import SVGIcons from "../svgicons";
import Text from "../Text";
import OptionGroupHead from "./groupHead";
import OptionItem from "./optionItem";
import { Option, SelectHandler, SelectInternalProps, SelectPrimitive, SelectProps, SelectValue } from "./types";

type SelectComponent = {
    <TMultiple extends boolean = false, TTokenizer extends boolean = false, TEditable extends boolean = false>(
        props: SelectProps<TMultiple, TTokenizer, TEditable> & { ref?: Ref<SelectHandler> }
    ): ReactElement
    displayName?: string
}

/**
 * Select component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Select options={[{ label: "Option 1", value: "1" }]} onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Select options={[{ label: "Red", value: "red" }, { label: "Blue", value: "blue" }]} multiple searchable onSelect={(item) => {}} />
 * ```
 * @param options - Array of available options
 * @param onChange - Callback function triggered when value changes
 * @param multiple - multiple prop
 * @param searchable - searchable prop
 * @param onSelect - Callback function triggered on selection
 */
const Select = (({
    ref,
    ...props
} : SelectInternalProps & {
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
        editable,
        editablePlaceholder,
        onChange,
        required,
        with: withProp,
        ...pops
    } = props

    const form = useForm()
    const inForm = name && form.values && form.setFieldValue
    const error = inForm ? form.errors?.[name] : null
    const formValue = inForm ? form.values?.[name] : undefined
    const supportsManualInput = editable === true && multiple !== true && tokenizer !== true

    const isPrimitiveValue = (val: unknown): val is SelectPrimitive => {
        return typeof val === "string" || typeof val === "number"
    }

    const isOptionValue = (val: unknown): val is Option => {
        return typeof val === "object" && val !== null && !Array.isArray(val) && "value" in val && "label" in val
    }

    const findOption = (val: SelectPrimitive) => {
        return options.find(o => String(o.value) === String(val))
    }

    const normalizeValue = (val: unknown): Option | Option[] | string | null => {
        if (val === undefined || val === null) return null
        if (supportsManualInput && val === "") return ""

        if (multiple || tokenizer) {
            const arr = Array.isArray(val) ? val : [val]
            return arr
                .map(item => isPrimitiveValue(item) ? findOption(item) : item)
                .filter((item): item is Option => isOptionValue(item))
        }

        if (isPrimitiveValue(val)) {
            const matched = findOption(val)
            if (matched) return matched
            return supportsManualInput ? String(val) : null
        }

        return isOptionValue(val) ? val : null
    }

    const getInitialValue = () => {
        if (selected !== undefined) return normalizeValue(selected)
        const defaultOption = options.find(o => String(o.value) === "-1")
        if (defaultOption) return defaultOption
        return supportsManualInput ? "" : null
    }

    const serializeValue = (nextValue: Option | Option[] | string | null) => {
        if (Array.isArray(nextValue)) return nextValue.map(v => v.value)
        if (isOptionValue(nextValue)) return nextValue.value
        return nextValue
    }

    const [ internalValue, setValue ] = useState<Option | Option[] | string | null>(() => getInitialValue())
    const [ choosing, setChoosing ] = useState(false)
    const [ query, setQuery ] = useState<string | null>(null)
    const _container = useRef<HTMLDivElement>(null)
    const _search = useRef<HTMLInputElement>(null)
    const _pop = useRef<HTMLDivElement>(null)
    const _did = useId()
    const _id = useMemo(() => name || _did, [name, _did])
    const { reposition } = usePosition(_pop as any, { direction: POSITION.Bottom, offset: 2 })
    const { variant: themeVariant } = useTheme(true)!

    const crossIcon = closeIcon ?
        typeof closeIcon === "string" ? <Icon name={closeIcon} />
            : closeIcon
                : SVGIcons.close

    const {
        className,
        style,
        rest
    } = useBase(pops, undefined)

    const {
        onClick: _baseOnClick,
        ...forwardedRest
    } = (rest || {}) as typeof rest & {
        onClick?: unknown
    }

    const value = useMemo(() => {
        if (formValue !== undefined) return normalizeValue(formValue)
        return internalValue
    }, [formValue, internalValue, options, supportsManualInput, multiple, tokenizer])

    const currentOption = useMemo(() => {
        if (!value || Array.isArray(value) || !isOptionValue(value)) return undefined
        return value
    }, [value])

    const editableValue = useMemo(() => {
        if (!supportsManualInput) return ""
        if (isOptionValue(value)) return String(value.value ?? "")
        if (isPrimitiveValue(value)) return String(value)
        return ""
    }, [supportsManualInput, value])

    const isSelected = (o: Option) => {
        if (Array.isArray(value)) return value.some(v => v.value === o.value)
        if (isOptionValue(value)) return value.value === o.value
        if (supportsManualInput && isPrimitiveValue(value)) return String(value) === String(o.value)
        return false
    }

    const updateStoredValue = (nextValue: Option | Option[] | string | null) => {
        if (inForm) {
            form.setFieldValue?.(name, serializeValue(nextValue))
            return
        }

        setValue(nextValue)
    }

    const emitChange = (nextValue: Option | Option[] | string) => {
        onChange?.(nextValue)
    }

    const updateValue = (o: Option) => {

        if (disabled || o.disabled) return

        if (multiple || tokenizer) {
            const current = Array.isArray(value) ? value : []
            const exists = current.find(v => v.value === o.value)
            const nextValue = exists
                ? current.filter(v => v.value !== o.value)
                : [...current, o]

            updateStoredValue(nextValue)
            emitChange(nextValue)
            return
        }

        updateStoredValue(o)
        setChoosing(false)
        emitChange(o)
    }

    const handleManualInput = (e: ChangeEvent<HTMLInputElement>) => {
        const nextRawValue = e.currentTarget.value
        const matchedOption = nextRawValue === "" ? null : findOption(nextRawValue)
        const nextValue = matchedOption ?? nextRawValue

        updateStoredValue(nextValue)
        emitChange(nextValue)
    }

    const handleEditableKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        e.preventDefault()

        if (supportsManualInput) {
            setChoosing(false)
        }
    }

    const removeToken = (e: React.MouseEvent, o: Option) => {
        e.stopPropagation()
        if (disabled) return
        const nextValue = (value as Option[]).filter(v => v.value !== o.value)

        updateStoredValue(nextValue)
        setChoosing(false)
        emitChange(nextValue)
    }

    const handleListWheel = (e: React.WheelEvent) => {
        const el = e.currentTarget
        const isAtTop = el.scrollTop === 0 && e.deltaY < 0
        const isAtBottom = el.scrollHeight - el.scrollTop === el.clientHeight && e.deltaY > 0

        if (!isAtTop && !isAtBottom) {
            e.stopPropagation()
        } else {
            e.preventDefault()
            e.stopPropagation()
        }
    }

    useImperativeHandle(ref, () => ({
        setSelected: (option: SelectValue) => {
            updateStoredValue(normalizeValue(option))
        },
        getValue: () => (value ?? null) as (Option | Option[] | SelectPrimitive | null)
    }), [value, options, supportsManualInput, multiple, tokenizer, inForm, name])

    useEffect(() => {
        if (inForm || selected === undefined) return
        setValue(normalizeValue(selected))
    }, [selected, inForm, options, supportsManualInput, multiple, tokenizer])

    useEffect(() => {
        if (!choosing) return

        const handleScroll = () => {
            reposition()
        }

        window.addEventListener("scroll", handleScroll, true)
        window.addEventListener("resize", reposition)

        return () => {
            window.removeEventListener("scroll", handleScroll, true)
            window.removeEventListener("resize", reposition)
        }
    }, [choosing, reposition])

    useEffect(() => {
        if (!choosing) {
            if (_search.current) _search.current.value = ""
            setQuery(null)
            return
        }

        _search.current?.focus()
        reposition()

        const handleOutsideClick = (e: MouseEvent) => {
            if (_container.current && !_container.current.contains(e.target as Node)) {
                setChoosing(false)
            }
        }

        const timeout = setTimeout(() => {
            document.addEventListener("click", handleOutsideClick)
        }, 0)

        return () => {
            clearTimeout(timeout)
            document.removeEventListener("click", handleOutsideClick)
        }
    }, [choosing, reposition])

    useEffect(() => {
        return () => {
            if (inForm) form.deleteFieldValue?.(name)
        }
    }, [form, inForm, name])

    const updateQuery = useDebounce((q: string) => setQuery(q === "" ? null : q), 300)

    return <Box
        ref={_container}
        data-required={required ? "true" : undefined}
        with={withProp}
        className={[
            `--select ${expanded == true ? `--expanded` : ``}`,
            `--${variant || themeVariant}`,
            `${name ? `--${name}` : ``}`,
            `${error ? "--has-error" : ""}`,
            `${disabled ? "--disabled" : ""} rel`
        ].join(" ").trim()} name={_id}>

        {supportsManualInput ? <Box
            data-value={currentOption?.value ?? (editableValue || "-1")}
            className={`--select-display --selected --editable flex aic rel ${className}`.trim()}
            style={style}
            onClick={(e) => e.stopPropagation()}
            {...forwardedRest as any}>
            { currentOption?.icon && <Icon as={`--selected-icon`} name={currentOption.icon} /> }
            <Flex aic as="--label-wrapper">
                <input
                    aria-expanded={choosing}
                    className="--select-input"
                    disabled={disabled}
                    onChange={handleManualInput}
                    onClick={(e) => {
                        e.stopPropagation()
                        if ( !disabled ) setChoosing(true)
                    }}
                    onKeyDown={handleEditableKeyDown}
                    placeholder={editablePlaceholder || label || "Choose"}
                    type="text"
                    value={editableValue}
                />
            </Flex>

            <Button
                className={`--select-toggle rel flex aic jcc`}
                disabled={disabled}
                onClick={(e) => {
                    e.stopPropagation()
                    if ( !disabled ) setChoosing(prev => !prev)
                }}
                tabIndex={-1}
                withLabel={false}>
                {choosing ?
                    typeof arrowUpIcon === "string" ? <Icon name={arrowUpIcon} as={`--search-action`} /> : arrowUpIcon :
                    typeof arrowDownIcon === "string" ? <Icon name={arrowDownIcon} as={`--search-action`} /> : arrowDownIcon}
            </Button>
        </Box> : <Button
            disabled={disabled}
            variant={variant || themeVariant}
            data-value={currentOption?.value ?? `-1`}
            className={`--select-display --selected flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                if ( !disabled ) setChoosing(prev => !prev)
            }}
            {...forwardedRest as any}>
            { currentOption?.icon && <Icon as={`--selected-icon`} name={currentOption.icon} /> }
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
                            {label || "Choose"}
                        </Text>}
                    </Flex>
                ) : (
                    <Text as="--label">
                        {Array.isArray(value)
                            ? (value.length > 0 ? `${value.length} selected` : label || "Choose")
                            : (currentOption?.label || label || "Choose")}
                    </Text>
                )}
            </Flex>

            <Box className={`--svg-arrow rel flex aic jcc`}>{choosing ?
                typeof arrowUpIcon === "string" ? <Icon name={arrowUpIcon} as={`--search-action`} /> : arrowUpIcon :
                typeof arrowDownIcon === "string" ? <Icon name={arrowDownIcon} as={`--search-action`} /> : arrowDownIcon}</Box>
        </Button>}

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
            { withSearch && <Box as={`--select-search --no-shrink flex --sticky`}><Search
                ref={_search}
                variant={Variant.Small}
                placeholder={searchPlaceholder || `Search...`}
                onChange={updateQuery}
            /></Box>}
            { label && <OptionGroupHead label={label} /> }
            {
                options
                ?.filter(o => !query || o.label.toLowerCase().includes(query.toLowerCase()))
                ?.map((o) => <OptionItem
                    updateValue={updateValue}
                    checkIcon={checkIcon}
                    selected={isSelected(o)}
                    key={`option-${o.label.replace(/\s+/g, `-`)}-${o.value}`}
                    o={o} />)
            }
        </Box>

    </Box>
}) as SelectComponent

Select.displayName = `Zuz.Select`

export default Select