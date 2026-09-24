
import { useAnchor } from "@zuzjs/hooks";
import { format } from "date-fns";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types/enums";
import Box from "../Box";
import { useFormActions, useFormFieldError, useFormFieldValue } from "../Form/context";
import Icon from "../Icon";
import Span from "../Span";
import SVGIcons from "../svgicons";
import Text from "../Text";
import Button from "../Button";
import Flex from "../Flex";
import { TimePickerProps, TimePickerValue } from "./types";

/**
 * TimePicker component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <TimePicker onTimeChange={(time) => console.log(time)} />
 * ```
 *
 * @example
 * // Advanced usage with 12-hour format
 * ```tsx
 * <TimePicker onTimeChange={(time) => console.log(time)} use12Hours showSeconds />
 * ```
 * @param onTimeChange - Callback function triggered when time changes
 * @param timeValue - Currently selected time
 * @param use12Hours - Whether to use 12-hour format
 * @param showSeconds - Whether to show seconds
 */
const TimePicker = forwardRef<HTMLInputElement, TimePickerProps>((props, ref) => {

    const {
        icon,
        defaultValue,
        timeValue,
        use12Hours = true,
        showSeconds = false,
        minHour = 0,
        maxHour = 23,
        minuteStep = 1,
        secondStep = 1,
        displayFormat,
        value,
        variant,
        placeholder,
        onTimeChange,
        onConfirm,
        name,
        ...pops
    } = props
    
    const form = useFormActions()
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
    const inForm = Boolean(name && form?.setFieldValue)
    
    // Parse time string to TimePickerValue
    const parseTimeValue = useCallback((val: unknown): TimePickerValue | null => {
        if (!val) return null;
        if (typeof val === 'object' && 'hour' in (val as TimePickerValue)) return val as TimePickerValue;
        if (typeof val === 'string') {
            // Parse format like "HH:mm" or "HH:mm:ss" or "HH:mm AM/PM"
            const match = val.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i);
            if (match) {
                let hour = parseInt(match[1], 10);
                const minute = parseInt(match[2], 10);
                const second = match[3] ? parseInt(match[3], 10) : 0;
                const period = match[4]?.toUpperCase() as "AM" | "PM" | undefined;
                
                // Convert 12-hour to 24-hour if needed
                if (period === "PM" && hour !== 12) {
                    hour += 12;
                } else if (period === "AM" && hour === 12) {
                    hour = 0;
                }
                
                return { hour, minute, second, period: use12Hours ? (hour < 12 ? "AM" : "PM") : undefined };
            }
        }
        return null;
    }, [use12Hours]);
    
    const [ choosing, setChoosing ] = useState(false);
    const [ currentTime, setCurrentTime ] = useState<TimePickerValue | null>(() => {
        if (timeValue !== undefined) return timeValue ?? null;
        if (inForm && formValue) return parseTimeValue(formValue) ?? defaultValue ?? null;
        return defaultValue ?? null;
    });
    
    // Helper to get display hour (converts 24h to 12h for display)
    const getDisplayHour = useCallback((hour: number): number => {
        if (use12Hours) {
            return hour === 0 ? 12 : (hour > 12 ? hour - 12 : hour);
        }
        return hour;
    }, [use12Hours]);
    
    // Temp selection state for picker
    const [tempHour, setTempHour] = useState<number>(() => {
        const hour = currentTime?.hour ?? new Date().getHours();
        return getDisplayHour(hour);
    });
    const [tempMinute, setTempMinute] = useState<number>(() => currentTime?.minute ?? new Date().getMinutes());
    const [tempSecond, setTempSecond] = useState<number>(() => currentTime?.second ?? 0);
    const [tempPeriod, setTempPeriod] = useState<"AM" | "PM">(() => {
        const hour = currentTime?.hour ?? new Date().getHours();
        return hour < 12 ? "AM" : "PM";
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
        if (typeof timeValue !== "undefined") {
            setCurrentTime(prev => {
                // Only update if the time actually changed
                if (prev?.hour !== timeValue?.hour || prev?.minute !== timeValue?.minute || prev?.second !== timeValue?.second) {
                    onTimeChange?.(timeValue);
                    return timeValue;
                }
                return prev;
            });
        }
    }, [timeValue, onTimeChange]);

    // Sync form value to state when form initializes or updates
    useEffect(() => {
        if (inForm && formValue !== undefined && formValue !== null) {
            const parsed = parseTimeValue(formValue);
            if (parsed) {
                setCurrentTime(prev => {
                    if (prev?.hour !== parsed.hour || prev?.minute !== parsed.minute || prev?.second !== parsed.second) {
                        onTimeChange?.(parsed);
                        return parsed;
                    }
                    return prev;
                });
            }
        }
    }, [inForm, formValue, parseTimeValue, onTimeChange]);

    const handleFocus = () => {
        // Initialize temp values with current time or now
        const baseHour = currentTime?.hour ?? new Date().getHours();
        const baseMinute = currentTime?.minute ?? new Date().getMinutes();
        const baseSecond = currentTime?.second ?? 0;
        
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
        
        // Round second to nearest valid step if needed
        const validSecond = Math.round(baseSecond / secondStep) * secondStep;
        setTempSecond(validSecond >= 60 ? 0 : validSecond);
        
        setChoosing(true);
    };

    const timeFormat = displayFormat || (use12Hours 
        ? (showSeconds ? "hh:mm:ss a" : "hh:mm a") 
        : (showSeconds ? "HH:mm:ss" : "HH:mm"));

    const inputValue = useMemo(() => {
        if (!currentTime) return value || ``;
        
        // Create a Date object with the time
        const date = new Date();
        date.setHours(currentTime.hour, currentTime.minute, currentTime.second || 0);
        
        return format(date, timeFormat);
    }, [currentTime, timeFormat, value]);

    const inputPlaceholder = useMemo(() => {
        if (placeholder) return placeholder;
        const date = new Date();
        return format(date, timeFormat);
    }, [placeholder, timeFormat]);

    // Generate hour options
    const hourOptions = useMemo(() => {
        const hours = [];
        const maxH = use12Hours ? 12 : 23;
        const minH = use12Hours ? 1 : minHour;
        for (let h = minH; h <= (use12Hours ? maxH : Math.min(maxHour, maxH)); h++) {
            hours.push(h);
        }
        return hours;
    }, [use12Hours, minHour, maxHour]);

    // Generate minute options
    const minuteOptions = useMemo(() => {
        const minutes = [];
        for (let m = 0; m < 60; m += minuteStep) {
            minutes.push(m);
        }
        return minutes;
    }, [minuteStep]);

    // Generate second options
    const secondOptions = useMemo(() => {
        const seconds = [];
        for (let s = 0; s < 60; s += secondStep) {
            seconds.push(s);
        }
        return seconds;
    }, [secondStep]);

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
        
        const newTime: TimePickerValue = {
            hour: finalHour,
            minute: tempMinute,
            second: showSeconds ? tempSecond : 0,
            period: use12Hours ? tempPeriod : undefined
        };
        
        setCurrentTime(newTime);
        onTimeChange?.(newTime);
        
        // Update form value
        if (inForm && name) {
            const date = new Date();
            date.setHours(newTime.hour, newTime.minute, newTime.second || 0);
            form?.setFieldValue?.(name, format(date, "HH:mm:ss"));
        }
        
        setChoosing(false);
    }, [tempHour, tempMinute, tempSecond, tempPeriod, use12Hours, showSeconds, onTimeChange, inForm, name, form]);

    const handleTimeCancel = useCallback(() => {
        setChoosing(false);
    }, []);

    const trigger = useMemo(() => <Box 
        as={`--time-picker --${variant || themeVariant || Variant.Medium} rel flex aic ${className}${error ? ` --has-error` : ``}`}
        data-value={currentTime ? `${currentTime.hour.toString().padStart(2, '0')}:${currentTime.minute.toString().padStart(2, '0')}${currentTime.second !== undefined ? ':' + currentTime.second.toString().padStart(2, '0') : ''}` : ``} >
        { icon ? `string` === typeof icon ? <Icon as={`mr:10 c:#666`} name={icon} /> : icon : <Span as={`--time-picker-icon flex aic jcc`}>{SVGIcons.clock}</Span> }
        <input
            name={name}
            ref={_input}
            value={inputValue}
            className={`--input --${variant || themeVariant || Variant.Medium} flex`.trim()}
            style={style}
            onFocus={handleFocus}
            placeholder={inputPlaceholder}
            readOnly
            onKeyDown={(e) => {
                if ( e.key == `Enter` ){
                    onConfirm?.(e.currentTarget.value);
                }
            }}
            {...rest}
            autoComplete="off" />
    </Box>, [className, currentTime, handleFocus, icon, inputPlaceholder, inputValue, onConfirm, rest, style, themeVariant, variant, error, name])

    const { root, canUseDocument, floatingRef, floatingStyle } = useAnchor(trigger, '--time-picker-anchor', {
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

    const chooser = <Flex cols
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
            as={`--time-picker-chooser abs --${variant || themeVariant || Variant.Medium}`}>
            <Flex as={`--time-picker-selector p:12`}>
                {/* Hour selector */}
                <Flex cols as={`flex:1`}>
                    <Text as={`--time-picker-section-head tac s:sm mb:8 c:$muted`}>Hour</Text>
                    <Box as={`--time-picker-scrollable flex cols gap:4`}>
                        {hourOptions.map(h => (
                            <Button
                                key={`hour-${h}`}
                                variant={variant || themeVariant || Variant.Small}
                                onClick={() => setTempHour(h)}
                                kind={tempHour === h ? `solid` : `ghost`}
                                as={[
                                    `--time-picker-item`,
                                    `${tempHour === h ? `--time-picker-item-selected` : ``}`
                                ]}>
                                {h.toString().padStart(2, '0')}
                            </Button>
                        ))}
                    </Box>
                </Flex>
                
                {/* Minute selector */}
                <Flex cols as={`flex:1`}>
                    <Text as={`--time-picker-section-head tac s:sm mb:8 c:$muted`}>Minute</Text>
                    <Box as={`--time-picker-scrollable flex cols gap:4`}>
                        {minuteOptions.map(m => (
                            <Button
                                key={`minute-${m}`}
                                variant={variant || themeVariant || Variant.Small}
                                onClick={() => setTempMinute(m)}
                                kind={tempMinute === m ? `solid` : `ghost`}
                                as={[
                                    `--time-picker-item`,
                                    `${tempMinute === m ? `--time-picker-item-selected` : ``}`
                                ]}>
                                {m.toString().padStart(2, '0')}
                            </Button>
                        ))}
                    </Box>
                </Flex>
                
                {/* Second selector (optional) */}
                {showSeconds && (
                    <Flex cols as={`flex:1`}>
                        <Text as={`--time-picker-section-head tac s:sm mb:8 c:$muted`}>Second</Text>
                        <Box as={`--time-picker-scrollable flex cols gap:4`}>
                            {secondOptions.map(s => (
                                <Button
                                    key={`second-${s}`}
                                    variant={variant || themeVariant || Variant.Small}
                                    onClick={() => setTempSecond(s)}
                                    kind={tempSecond === s ? `solid` : `ghost`}
                                    as={[
                                        `--time-picker-item`,
                                        `${tempSecond === s ? `--time-picker-item-selected` : ``}`
                                    ]}>
                                    {s.toString().padStart(2, '0')}
                                </Button>
                            ))}
                        </Box>
                    </Flex>
                )}
                
                {/* AM/PM selector (for 12-hour format) */}
                {use12Hours && (
                    <Flex cols as={`--time-picker-period`}>
                        <Text as={`--time-picker-section-head tac s:sm mb:8 c:$muted`}>Period</Text>
                        <Box as={`--time-picker-scrollable flex cols gap:4`}>
                            {(["AM", "PM"] as const).map(p => (
                                <Button
                                    key={`period-${p}`}
                                    variant={variant || themeVariant || Variant.Small}
                                    onClick={() => setTempPeriod(p)}
                                    kind={tempPeriod === p ? `solid` : `ghost`}
                                    as={[
                                        `--time-picker-item`,
                                        `${tempPeriod === p ? `--time-picker-item-selected` : ``}`
                                    ]}>
                                    {p}
                                </Button>
                            ))}
                        </Box>
                    </Flex>
                )}
            </Flex>
            
            {/* Action buttons */}
            <Flex aic jcc gap={8} as={`--timepicker-footer p:12 pt:0`}>
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
        </Flex>

    return <>
        {root}
        {canUseDocument
            ? createPortal(chooser, document.body)
            : null}
    </>
})

TimePicker.displayName = `Zuz.TimePicker`

export default TimePicker
