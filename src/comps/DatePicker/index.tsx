
import { useAnchor } from "@zuzjs/hooks";
import { format, isValid, parse, parseISO } from "date-fns";
import { forwardRef, InputEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types/enums";
import Box from "../Box";
import Calendar from "../Calendar";
import { CalendarRangeValue } from "../Calendar/types";
import { useFormActions, useFormFieldError, useFormFieldValue } from "../Form/context";
import Icon from "../Icon";
import Span from "../Span";
import SVGIcons from "../svgicons";
import Text from "../Text";
import Button from "../Button";
import Flex from "../Flex";
import { DatePickerProps, DatePickerMode } from "./types";

/**
 * DatePicker component.
 *
 * @example
 * // Basic usage - date mode (default)
 * ```tsx
 * <DatePicker onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Time mode
 * ```tsx
 * <DatePicker mode="time" onDateChange={(date) => console.log(date)} use12Hours />
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
 * @param mode - "date" (default) or "time"
 */
const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {

    const {
        icon,
        mode = "date",
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
        name,
        selectYear = true,
        use12Hours = false,
        showSeconds = false,
        minuteStep = 1,
        ...pops
    } = props
    
    const form = useFormActions()
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
    const inForm = Boolean(name && form?.setFieldValue)
    
    // Helper to parse form value if provided
    // Try multiple formats: ISO, DD/M/YYYY, DD/MM/YYYY
    const parseFormValue = useCallback((val: unknown): Date | null => {
        if (!val) return null;
        if (val instanceof Date) return val;
        if (typeof val === 'string') {
            // Try ISO format first
            let parsed = parseISO(val);
            if (isValid(parsed)) return parsed;
            
            // Try common date formats
            parsed = parse(val, 'dd/M/yyyy', new Date());
            if (isValid(parsed)) return parsed;
            
            parsed = parse(val, 'dd/MM/yyyy', new Date());
            if (isValid(parsed)) return parsed;
            
            parsed = parse(val, 'dd-MM-yyyy', new Date());
            if (isValid(parsed)) return parsed;
            
            parsed = parse(val, 'MM/dd/yyyy', new Date());
            if (isValid(parsed)) return parsed;
            
            return null;
        }
        return null;
    }, []);
    
    const [ choosing, setChoosing ] = useState(false);
    const [ currentDate, setCurrentDate ] = useState<Date | null>(() => {
        if (dateValue !== undefined) return dateValue ?? null;
        if (inForm && formValue) return parseFormValue(formValue) ?? defaultValue ?? null;
        return defaultValue ?? null;
    });
    const [ currentRange, setCurrentRange ] = useState<CalendarRangeValue>(() => {
        if (rangeValue !== undefined) return rangeValue;
        if (defaultRangeValue !== undefined) return defaultRangeValue;
        return { start: null, end: null };
    });
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
            setCurrentDate(prev => {
                // Only update if the date actually changed
                if (prev?.getTime() !== dateValue?.getTime()) {
                    onDateChange?.(dateValue);
                    return dateValue;
                }
                return prev;
            });
        }
    }, [dateValue, onDateChange]);

    // Sync form value to state when form initializes or updates
    useEffect(() => {
        if (inForm && formValue !== undefined && formValue !== null) {
            const parsed = parseFormValue(formValue);
            if (parsed) {
                setCurrentDate(prev => {
                    // Only update if the date actually changed
                    if (prev?.getTime() !== parsed.getTime()) {
                        onDateChange?.(parsed);
                        return parsed;
                    }
                    return prev;
                });
            }
        }
    }, [inForm, formValue, parseFormValue, onDateChange]);

    useEffect(() => {
        if (typeof rangeValue !== "undefined") {
            setCurrentRange(rangeValue);
            onRangeChange?.(rangeValue);
        }
    }, [rangeValue, onRangeChange]);

    // Time mode state
    const [tempHour, setTempHour] = useState<number>(() => {
        const hour = currentDate?.getHours() ?? new Date().getHours();
        // For 12-hour format, convert to display hour
        if (use12Hours) {
            return hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        }
        return hour;
    });
    const [tempMinute, setTempMinute] = useState<number>(() => currentDate?.getMinutes() ?? new Date().getMinutes());
    const [tempSecond, setTempSecond] = useState<number>(() => currentDate?.getSeconds() ?? 0);
    const [tempPeriod, setTempPeriod] = useState<"AM" | "PM">(() => {
        const hour = currentDate?.getHours() ?? new Date().getHours();
        return hour < 12 ? "AM" : "PM";
    });

    const handleInput : InputEventHandler<HTMLInputElement>  = (event) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }

    const handleFocus = () => {
        // Initialize temp values with current time or now for time mode
        if (mode === "time") {
            const baseHour = currentDate?.getHours() ?? new Date().getHours();
            const baseMinute = currentDate?.getMinutes() ?? new Date().getMinutes();
            const baseSecond = currentDate?.getSeconds() ?? 0;
            
            // For 12-hour format, convert 24-hour to 12-hour display
            if (use12Hours) {
                const displayHour = baseHour === 0 ? 12 : (baseHour > 12 ? baseHour - 12 : baseHour);
                setTempHour(displayHour);
                setTempPeriod(baseHour < 12 ? "AM" : "PM");
            } else {
                setTempHour(baseHour);
            }
            
            // Round minute to nearest valid step if needed
            const validMinute = Math.round(baseMinute / minuteStep) * minuteStep;
            setTempMinute(validMinute >= 60 ? 0 : validMinute);
            
            setTempSecond(baseSecond);
        }
        setChoosing(true);
    };

    // Generate hour options for time mode
    const hourOptions = useMemo(() => {
        if (mode !== "time") return [];
        const hours = [];
        const maxH = use12Hours ? 12 : 23;
        const minH = use12Hours ? 1 : 0;
        for (let h = minH; h <= maxH; h++) {
            hours.push(h);
        }
        return hours;
    }, [mode, use12Hours]);

    // Generate minute options for time mode
    const minuteOptions = useMemo(() => {
        if (mode !== "time") return [];
        const minutes = [];
        for (let m = 0; m < 60; m += minuteStep) {
            minutes.push(m);
        }
        return minutes;
    }, [mode, minuteStep]);

    // Generate second options for time mode
    const secondOptions = useMemo(() => {
        if (mode !== "time" || !showSeconds) return [];
        const seconds = [];
        for (let s = 0; s < 60; s++) {
            seconds.push(s);
        }
        return seconds;
    }, [mode, showSeconds]);

    const handleTimeConfirm = useCallback(() => {
        let finalHour = tempHour;
        
        // Convert 12-hour to 24-hour if needed
        if (use12Hours) {
            if (tempPeriod === "PM" && tempHour !== 12) {
                finalHour = tempHour + 12;
            } else if (tempPeriod === "AM" && tempHour === 12) {
                finalHour = 0;
            }
        }
        
        const newDate = new Date();
        newDate.setHours(finalHour, tempMinute, showSeconds ? tempSecond : 0, 0);
        
        setCurrentDate(newDate);
        onDateChange?.(newDate);
        
        // Update form value
        if (inForm && name) {
            form?.setFieldValue?.(name, newDate.toISOString());
        }
        
        setChoosing(false);
    }, [tempHour, tempMinute, tempSecond, tempPeriod, use12Hours, showSeconds, onDateChange, inForm, name, form]);

    const handleTimeCancel = useCallback(() => {
        setChoosing(false);
    }, []);

    const dateFormat = displayFormat || (mode === "time" 
        ? (use12Hours ? (showSeconds ? `hh:mm:ss a` : `hh:mm a`) : (showSeconds ? `HH:mm:ss` : `HH:mm`))
        : `EEE, MMM d, yyy hh:mm a`);

    const inputValue = useMemo(() => {
        if (range && mode === "date") {
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
    }, [currentDate, currentRange, dateFormat, range, value, mode]);

    const inputPlaceholder = useMemo(() => {
        if (placeholder) return placeholder;
        if (range && mode === "date") {
            return `${format(new Date(), `MMM d, yyy`)} - ${format(new Date(), `MMM d, yyy`)}`;
        }
        if (mode === "time") {
            const now = new Date();
            return format(now, dateFormat);
        }
        return format(currentDate ?? new Date(), `MMM d, yyy`);
    }, [currentDate, placeholder, range, mode, dateFormat]);

    const iconSvg = mode === "time" ? SVGIcons.clock : SVGIcons.calendar;

    const trigger = useMemo(() => <Box 
        as={`--date-picker --${variant || themeVariant || Variant.Medium} rel flex aic ${className}${error ? ` --has-error` : ``}`} 
        data-value={currentDate ? currentDate.toISOString() : ``} >
        { icon ? `string` === typeof icon ? <Icon as={`mr:10 c:#666`} name={icon} /> : icon : <Span as={`--date-picker-icon flex aic jcc`}>{iconSvg}</Span> }
        <input
            name={name}
            ref={_input}
            value={inputValue}
            className={`--input --${variant || themeVariant || Variant.Medium} flex`.trim()}
            style={style}
            onFocus={handleFocus}
            onInput={handleInput}
            placeholder={inputPlaceholder}
            readOnly={mode === "time"}
            onKeyDown={(e) => {
                if ( e.key == `Enter` ){
                    onConfirm?.(e.currentTarget.value);
                }
            }}
            {...rest}
            autoComplete="off" />
    </Box>, [className, currentDate, handleFocus, handleInput, icon, inputPlaceholder, inputValue, onConfirm, rest, style, themeVariant, variant, error, name, mode, iconSvg])

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
            as={`--date-picker-chooser abs flex ${mode === "time" ? "cols" : "aic"} ${variant ? `--${variant}` : ``}`}>
            {mode === "time" ? (
                <>
                    <Flex cols gap={10} as={`--time-picker-selector p:12`}>
                        {/* Hour selector */}
                        <Flex cols as={`flex:1`}>
                            <Text as={`tac s:sm mb:8 c:$muted`}>Hour</Text>
                            <Box as={`--time-select-scroll flex cols gap:4`}>
                                {hourOptions.map(h => (
                                    <Button
                                        key={`hour-${h}`}
                                        variant={variant || themeVariant || Variant.Small}
                                        onClick={() => setTempHour(h)}
                                        as={[
                                            `--time-select-item`,
                                            `${tempHour === h ? `--time-select-item-selected` : ``}`
                                        ]}>
                                        {h.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </Box>
                        </Flex>
                        
                        {/* Minute selector */}
                        <Flex cols as={`flex:1`}>
                            <Text as={`tac s:sm mb:8 c:$muted`}>Minute</Text>
                            <Box as={`--time-select-scroll flex cols gap:4`}>
                                {minuteOptions.map(m => (
                                    <Button
                                        key={`minute-${m}`}
                                        variant={variant || themeVariant || Variant.Small}
                                        onClick={() => setTempMinute(m)}
                                        as={[
                                            `--time-select-item`,
                                            `${tempMinute === m ? `--time-select-item-selected` : ``}`
                                        ]}>
                                        {m.toString().padStart(2, '0')}
                                    </Button>
                                ))}
                            </Box>
                        </Flex>
                        
                        {/* Second selector (optional) */}
                        {showSeconds && (
                            <Flex cols as={`flex:1`}>
                                <Text as={`tac s:sm mb:8 c:$muted`}>Second</Text>
                                <Box as={`--time-select-scroll flex cols gap:4`}>
                                    {secondOptions.map(s => (
                                        <Button
                                            key={`second-${s}`}
                                            variant={variant || themeVariant || Variant.Small}
                                            onClick={() => setTempSecond(s)}
                                            as={[
                                                `--time-select-item`,
                                                `${tempSecond === s ? `--time-select-item-selected` : ``}`
                                            ]}>
                                            {s.toString().padStart(2, '0')}
                                        </Button>
                                    ))}
                                </Box>
                            </Flex>
                        )}
                        
                        {/* AM/PM selector (for 12-hour format) */}
                        {use12Hours && (
                            <Flex cols as={`--time-select-period`}>
                                <Text as={`tac s:sm mb:8 c:$muted`}>Period</Text>
                                <Box as={`--time-select-scroll flex cols gap:4`}>
                                    {(["AM", "PM"] as const).map(p => (
                                        <Button
                                            key={`period-${p}`}
                                            variant={variant || themeVariant || Variant.Small}
                                            onClick={() => setTempPeriod(p)}
                                            as={[
                                                `--time-select-item`,
                                                `${tempPeriod === p ? `--time-select-item-selected` : ``}`
                                            ]}>
                                            {p}
                                        </Button>
                                    ))}
                                </Box>
                            </Flex>
                        )}
                    </Flex>
                    
                    {/* Action buttons for time mode */}
                    <Flex aic jcc gap={8} as={`p:12 pt:0`}>
                        <Button 
                            kind="subtle" 
                            onClick={handleTimeCancel}
                            variant={variant || themeVariant || Variant.Small}
                            as={`flex:1`}>
                            Cancel
                        </Button>
                        <Button 
                            kind="solid" 
                            onClick={handleTimeConfirm}
                            variant={variant || themeVariant || Variant.Small}
                            as={`flex:1`}>
                            OK
                        </Button>
                    </Flex>
                </>
            ) : (
                <Calendar 
                    value={currentDate}
                    defaultValue={defaultValue}
                    minDate={minDate}
                    maxDate={maxDate}
                    range={range}
                    name={name}
                    selectYear={selectYear}
                    disableQuickOptions={disableQuickOptions}
                    disabledDates={disabledDates}
                    rangeValue={currentRange}
                    defaultRangeValue={defaultRangeValue}
                    variant={variant || themeVariant || Variant.Medium}
                    onChange={(dt, meta) => {
                        setCurrentDate(dt)
                        onDateChange?.(dt)
                        // Update form value
                        if (inForm && name && dt) {
                            form?.setFieldValue?.(name, dt.toISOString());
                        }
                        if (meta?.source !== "month") {
                            setChoosing(false)
                        }
                    }}
                    onRangeChange={(nextRange) => {
                        setCurrentRange(nextRange)
                        onRangeChange?.(nextRange)
                        // Update form value
                        if (inForm && name && nextRange.start && nextRange.end) {
                            form?.setFieldValue?.(name, {
                                start: nextRange.start.toISOString(),
                                end: nextRange.end.toISOString()
                            });
                        }
                        if (nextRange.start && nextRange.end) {
                            setChoosing(false)
                        }
                    }} />
            )}
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