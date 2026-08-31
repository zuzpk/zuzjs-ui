"use client"
import { useAnchor, useDebounce } from "@zuzjs/hooks";
import { ChangeEvent, ReactElement, Ref, useEffect, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import { useFormActions, useFormFieldError, useFormFieldValue } from "../Form/context";
import Icon from "../Icon";
import Input from "../Input";
import Search from "../Search";
import { SearchHandler } from "../Search/types";
import SVGIcons from "../svgicons";
import Text from "../Text";
import OptionGroupHead from "./groupHead";
import OptionItem from "./optionItem";
import type { Option, SelectEditableProps, SelectHandler, SelectInternalProps, SelectMultipleProps, SelectPrimitive, SelectSingleProps, SelectTokenizerProps, SelectValue } from "./types";

const SELECT_OPEN_EVENT = "zuz-select-open";

type SelectPublicProps = SelectSingleProps | SelectEditableProps | SelectMultipleProps | SelectTokenizerProps

type SelectComponent = {
    (props: SelectSingleProps & { ref?: Ref<SelectHandler> }): ReactElement
    (props: SelectEditableProps & { ref?: Ref<SelectHandler> }): ReactElement
    (props: SelectMultipleProps & { ref?: Ref<SelectHandler> }): ReactElement
    (props: SelectTokenizerProps & { ref?: Ref<SelectHandler> }): ReactElement
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
        kind = `solid`,
        variant,
        searchVariant,
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
        forceExpandSubOptions,
        render: renderOption,
        editable,
        editablePlaceholder,
        onChange,
        required,
        with: withProp,
        ...pops
    } = props

    const form = useFormActions()
    const inForm = Boolean(name && form?.setFieldValue)
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
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
    const [ expandedSubtrees, setExpandedSubtrees ] = useState<Set<string>>(new Set())
    const [ optionsMinWidth, setOptionsMinWidth ] = useState<number | undefined>(undefined)
    const _container = useRef<HTMLDivElement>(null)
    const _search = useRef<SearchHandler>(null)
    const _pop = useRef<HTMLDivElement>(null)
    const _did = useId()
    const _id = useMemo(() => name || _did, [name, _did])
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
        if (inForm && form?.setFieldValue && name) {
            form.setFieldValue(name, serializeValue(nextValue))
            return
        }

        setValue(nextValue)
    }

    const emitChange = (nextValue: Option | Option[] | string) => {
        onChange?.(
            editable === true &&
            nextValue instanceof Option ? String(nextValue.value) :
                nextValue
        )
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
        const nextRawValue = e.target.value
        const matchedOption = nextRawValue === "" ? null : findOption(nextRawValue)
        const nextValue = matchedOption ? matchedOption.value : nextRawValue

        updateStoredValue(nextValue as string)
        emitChange(nextValue as string)
    }

    const handleEditableKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key !== "Enter") return
        e.preventDefault()

        if (supportsManualInput) {
            const nextRawValue = e.currentTarget.value.trim()
            if (!nextRawValue) {
                setChoosing(false)
                return
            }

            const matchedOption = findOption(nextRawValue as SelectPrimitive)
            const nextValue = matchedOption ?? nextRawValue

            updateStoredValue(nextValue)
            emitChange(nextValue)
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
        if (!choosing) {
            if (_search.current) _search.current?.setValue("")
            setQuery(null)
            setExpandedSubtrees(new Set())
            return
        }

        _search.current?.focus()

        const handleOutsidePointerDown = (e: MouseEvent) => {
            const target = e.target as Node
            const clickedInsideTrigger = _container.current?.contains(target)
            const clickedInsidePop = _pop.current?.contains(target)
            if (!clickedInsideTrigger && !clickedInsidePop) {
                setChoosing(false)
            }
        }

        document.addEventListener("mousedown", handleOutsidePointerDown, true)

        return () => {
            document.removeEventListener("mousedown", handleOutsidePointerDown, true)
        }
    }, [choosing])

    useEffect(() => {
        const onSelectOpen = (e: Event) => {
            const detail = (e as CustomEvent<{ id?: string }>).detail
            if (!detail?.id) return
            if (detail.id === _id) return
            setChoosing(false)
        }

        document.addEventListener(SELECT_OPEN_EVENT, onSelectOpen as EventListener)
        return () => {
            document.removeEventListener(SELECT_OPEN_EVENT, onSelectOpen as EventListener)
        }
    }, [_id])

    useEffect(() => {
        if (!choosing) return
        document.dispatchEvent(new CustomEvent(SELECT_OPEN_EVENT, { detail: { id: _id } }))
    }, [choosing, _id])

    useEffect(() => {
        const syncOptionsMinWidth = () => {
            const displayEl = _container.current?.querySelector(".--select-display") as HTMLElement | null
            setOptionsMinWidth(displayEl?.offsetWidth)
        }

        syncOptionsMinWidth()

        if (!choosing) return

        window.addEventListener("resize", syncOptionsMinWidth)
        return () => {
            window.removeEventListener("resize", syncOptionsMinWidth)
        }
    }, [choosing, value, supportsManualInput, variant, themeVariant, className])

    const updateQuery = useDebounce((q: string) => setQuery(q === "" ? null : q), 300)
    const updateManualInput = useDebounce(handleManualInput, 300)
    // const updateManualInput = useDebounce((e: ChangeEvent<HTMLInputElement>) => handleManualInput(e), 300)

    const filterOptionTree = (items: Option[]): Option[] => {
        if (!query) return items;
        const q = query.toLowerCase();

        return items.reduce<Option[]>((acc, option) => {
            const labelMatch = option.label.toLowerCase().includes(q);
            const nextSubOptions = option.subOptions ? filterOptionTree(option.subOptions) : [];

            if (labelMatch || nextSubOptions.length > 0) {
                acc.push({
                    ...option,
                    subOptions: nextSubOptions.length > 0 ? nextSubOptions : option.subOptions,
                });
            }

            return acc;
        }, []);
    };

    const renderOptionTree = (items: Option[], depth = 0, path = "root"): ReactElement[] => {
        return items.flatMap((option, index) => {
            const nodeKey = `${path}.${index}.${String(option.value)}`;
            const hasSubOptions = !!(option.subOptions && option.subOptions.length > 0);
            const isExpanded = forceExpandSubOptions === true || !!query || expandedSubtrees.has(nodeKey);
            const node = <OptionItem
                updateValue={updateValue}
                checkIcon={checkIcon}
                selected={isSelected(option)}
                key={`option-${nodeKey}-${option.label.replace(/\s+/g, `-`)}`}
                depth={depth}
                hasSubOptions={hasSubOptions}
                expanded={isExpanded}
                forceExpanded={forceExpandSubOptions === true}
                renderOption={renderOption}
                onToggleExpand={() => {
                    setExpandedSubtrees((prev) => {
                        const next = new Set(prev);
                        if (next.has(nodeKey)) next.delete(nodeKey);
                        else next.add(nodeKey);
                        return next;
                    });
                }}
                o={option} />;

            if (!hasSubOptions) return [node];
            if (!isExpanded) return [node];
            return [node, ...renderOptionTree(option.subOptions!, depth + 1, nodeKey)];
        });
    };

    const visibleOptions = useMemo(() => filterOptionTree(options || []), [options, query]);

    const trigger = useMemo(() => <Box
        ref={_container}
        data-required={required ? "true" : undefined}
        with={withProp}
        className={[
            `--select ${expanded == true ? `--expanded` : ``}`,
            `--${variant || themeVariant || Variant.Medium}`,
            `${name ? `--${name}` : ``}`,
            `${error ? "--has-error" : ""}`,
            `${disabled ? "--disabled" : ""} rel`
        ].join(" ").trim()} name={_id}>

        {supportsManualInput ? <Box
            data-value={currentOption?.value ?? (editableValue || "-1")}
            className={`--select-display --select-anchor --selected --editable --${kind} flex aic rel ${className}`.trim()}
            style={style}
            onClick={(e) => e.stopPropagation()}
            {...forwardedRest as any}>
            { currentOption?.icon && <Icon as={`--selected-icon`} name={currentOption.icon} color={currentOption.iconColor} /> }
            <Flex aic as="--label-wrapper">
                <Input
                    aria-expanded={choosing}
                    className="--select-input"
                    disabled={disabled}
                    onChange={updateManualInput}
                    onClick={(e) => {
                        e.stopPropagation()
                        if ( !disabled ) setChoosing(true)
                    }}
                    onKeyDown={handleEditableKeyDown}
                    placeholder={editablePlaceholder || label || "Choose"}
                    type="text"
                    defaultValue={editableValue}
                />
            </Flex>

            <Button
                className={`--select-toggle rel flex aic jcc`}
                disabled={disabled}
                kind="plain"
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
            kind={kind}
            variant={variant || themeVariant || Variant.Medium}
            data-value={
                (tokenizer || multiple) && Array.isArray(value) && value.length > 0
                    ? value.map(v => v.value).join(",")
                    : (currentOption?.value ?? `-1`)
            }
            className={`--select-display --selected --select-anchor --${kind} flex aic rel ${className}`.trim()}
            withLabel={false}
            style={style}
            onClick={(e) => {
                e.stopPropagation()
                if ( !disabled ) setChoosing(prev => !prev)
            }}
            {...forwardedRest as any}>
            { currentOption?.icon && <Icon as={`--selected-icon`} name={currentOption.icon} color={currentOption.iconColor} /> }
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

    </Box>, [required, withProp, expanded, variant, themeVariant, name, error, disabled, _id,
        supportsManualInput, currentOption, editableValue, className, style, forwardedRest,
        updateManualInput, handleEditableKeyDown, editablePlaceholder, label, arrowDownIcon, arrowUpIcon,
        choosing, tokenizer, value, wrapTokens, options, crossIcon, removeToken])

    const { root, canUseDocument, floatingRef, floatingStyle, isPositioned } = useAnchor(trigger, '--select-anchor', {
        open: choosing,
        autoFlip: true,
        preferredPlacement: 'bottom',
        margin: 2,
    })

    const optionsList = <Box
        id={_id}
        className={`--select-options-list --options-list --${variant || themeVariant || Variant.Medium} --allow-scroll -fx flex cols fixed zIndex:var(--max-z-index)`}
        aria-hidden={!choosing}
        onWheel={handleListWheel}
        style={{
            ...floatingStyle,
            visibility: choosing && isPositioned ? "visible" : "hidden",
            pointerEvents: choosing && isPositioned ? "auto" : "none",
            minWidth: optionsMinWidth ? `${optionsMinWidth}px` : "anchor-size(width)",
            maxHeight: maxHeight || `auto`
        }}
        ref={(node) => {
            _pop.current = node;
            floatingRef.current = node;
        }}
        fx={{
            from: { y: 5, opacity: 0 },
            to: { y: 0, opacity: 1 },
            when: choosing && isPositioned,
            duration: .05
        }}>
        { withSearch && <Box as={`--select-search --no-shrink flex --sticky`}><Search
            ref={_search}
            autoFocus
            variant={searchVariant || Variant.Small}
            placeholder={searchPlaceholder || `Search...`}
            onChange={updateQuery}
        /></Box>}
        { label && <OptionGroupHead label={label} /> }
        {renderOptionTree(visibleOptions)}
    </Box>

    return <>
        {root}
        {canUseDocument ? createPortal(optionsList, document.body) : null}
    </>
}) as SelectComponent

Select.displayName = `Zuz.Select`

export default Select