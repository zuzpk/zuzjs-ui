
import { useAnchor } from "@zuzjs/hooks";
import { format } from "date-fns";
import { forwardRef, InputEventHandler, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types/enums";
import Box from "../Box";
import Calendar from "../Calendar";
import { CalendarRangeValue } from "../Calendar/types";
import Icon from "../Icon";
import Span from "../Span";
import SVGIcons from "../svgicons";
import { DatePickerProps } from "./types";

/**
 * DatePicker component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <DatePicker onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <DatePicker onChange={(date) => console.log(date)} selected={new Date()} format="MM/dd/yyyy" disabled={false} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param selected - Currently selected item/date
 * @param format - format prop
 * @param disabled - Whether component is disabled
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {

    const {
        icon,
        defaultValue,
        dateValue,
        minDate,
        maxDate,
        range,
        defaultRangeValue,
        rangeValue,
        disabledDates,
        disableQuickOptions,
        displayFormat,
        value,
        size,
        variant,
        numeric,
        type,
        placeholder,
        onDateChange,
        onRangeChange,
        onConfirm,
        ...pops
    } = props
    const [ choosing, setChoosing ] = useState(false);
    const [ currentDate, setCurrentDate ] = useState<Date | null>(dateValue ?? defaultValue ?? null);
    const [ currentRange, setCurrentRange ] = useState<CalendarRangeValue>(
        rangeValue ?? defaultRangeValue ?? { start: null, end: null }
    );
    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)
    const _input = useRef<HTMLInputElement>(null);
    const _pop = useRef<HTMLDivElement>(null);
    const { variant: themeVariant } = useTheme(true)!

    useEffect(() => {
        if (typeof dateValue !== "undefined") {
            setCurrentDate(dateValue);
        }
    }, [dateValue]);

    useEffect(() => {
        if (typeof rangeValue !== "undefined") {
            setCurrentRange(rangeValue);
        }
    }, [rangeValue]);

    const handleInput : InputEventHandler<HTMLInputElement>  = (event) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }

    const handleFocus = () => {
        setChoosing(true);
    };

    const dateFormat = displayFormat || `EEE, MMM d, yyy hh:mm a`;

    const inputValue = useMemo(() => {
        if (range) {
            const { start, end } = currentRange;
            if (start && end) {
                return `${format(start, dateFormat)} - ${format(end, dateFormat)}`;
            }
            if (start) {
                return `${format(start, dateFormat)} - ...`;
            }
            return value || ``;
        }

        return currentDate ? format(currentDate, dateFormat) : (value || ``);
    }, [currentDate, currentRange, dateFormat, range, value]);

    const inputPlaceholder = useMemo(() => {
        if (placeholder) return placeholder;
        if (range) {
            return `${format(new Date(), `MMM d, yyy`)} - ${format(new Date(), `MMM d, yyy`)}`;
        }
        return format(currentDate ?? new Date(), `MMM d, yyy`);
    }, [currentDate, placeholder, range]);

    const trigger = useMemo(() => <Box 
        as={`--date-picker --${variant || themeVariant || Variant.Small} rel flex aic ${className}`} 
        data-value={currentDate ? currentDate.toISOString() : ``} >
        { icon ? `string` === typeof icon ? <Icon as={`mr:10 c:#666`} name={icon} /> : icon : <Span as={`--date-picker-icon flex aic jcc`}>{SVGIcons.calendar}</Span> }
        <input
            ref={_input}
            value={inputValue}
            className={`--input ${variant ? `--${variant}` : ``} flex`.trim()}
            style={style}
            onFocus={handleFocus}
            onInput={handleInput}
            placeholder={inputPlaceholder}
            onKeyDown={(e) => {
                if ( e.key == `Enter` ){
                    onConfirm?.(e.currentTarget.value);
                }
            }}
            {...rest}
            autoComplete="off" />
    </Box>, [className, currentDate, handleFocus, handleInput, icon, inputPlaceholder, inputValue, onConfirm, rest, style, themeVariant, variant])

    const { root, canUseDocument, floatingRef, floatingStyle } = useAnchor(trigger, '--date-picker-anchor', {
        open: choosing,
        autoFlip: true,
        preferredPlacement: 'bottom',
        margin: 10,
    })

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            
            const target = e.target as Node;

            const clickedInsideInput = _input.current?.contains(target);
            const clickedInsidePop = _pop.current?.contains(target);

            if (!clickedInsideInput && !clickedInsidePop) {
                setChoosing(false);
            }

        };

        if (choosing) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [choosing]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && choosing) {
                setChoosing(false);
                _input.current?.focus();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [choosing]);

    const chooser = <Box 
            aria-hidden={!choosing}
            ref={(node) => {
                _pop.current = node;
                floatingRef.current = node;
            }}
            style={floatingStyle}
            fx={{
                from: { y: 5, opacity: 0 },
                to: { y: 0, opacity: 1 },
                when: choosing,
                duration: .05
            }}
            as={`--date-picker-chooser abs flex aic ${variant ? `--${variant}` : ``}`}>
            <Calendar 
                value={currentDate}
                defaultValue={defaultValue}
                minDate={minDate}
                maxDate={maxDate}
                range={range}
                disableQuickOptions={disableQuickOptions}
                disabledDates={disabledDates}
                rangeValue={currentRange}
                defaultRangeValue={defaultRangeValue}
                variant={variant || themeVariant || Variant.Small}
                onChange={(dt, meta) => {
                    setCurrentDate(dt)
                    onDateChange?.(dt)
                    if (meta?.source !== "month") {
                        setChoosing(false)
                    }
                }}
                onRangeChange={(nextRange) => {
                    setCurrentRange(nextRange)
                    onRangeChange?.(nextRange)
                    if (nextRange.start && nextRange.end) {
                        setChoosing(false)
                    }
                }} />
        </Box>

    return <>
        {root}
        {canUseDocument
            ? createPortal(chooser, document.body)
            : null}
    </>
})

DatePicker.displayName = `Zuz.DatePicker`

export default DatePicker