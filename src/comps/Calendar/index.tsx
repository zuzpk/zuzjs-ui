import { addDays, addHours, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isToday, isValid, isWithinInterval, parse, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarDisabledDateInput, CalendarProps, CalendarQuickOptionInput, CalendarQuickOptionLabel, CalendarRangeValue } from "./types";

const _quickDateOptions = [
    { 
        label: 'Today', 
        getDate: () => new Date(),
        getDateFormat: () => format(new Date(), 'EEE'),
    },
    { 
        label: 'Later', 
        getDate: () => new Date(),
        getDateFormat: () => format(addHours(new Date(), 2), 'hh:mm a'),
    },
    { 
        label: 'Tomorrow', 
        getDate: () => addDays(new Date(), 1),
        getDateFormat: () => format(addDays(new Date(), 1), 'EEE'),
    },
    { 
        label: 'This weekend', 
        getDate: () => {
            const today = new Date();
            const day = today.getDay();
            //Saturday
            return addDays(today, (6 - day) % 7 || 6);
        },
        getDateFormat: () => {
            const today = new Date();
            const day = today.getDay();
            return format(addDays(today, (6 - day) % 7 || 6), 'EEE, MMM d')
        },
    },
    { 
        label: 'Next week', 
        getDateFormat: () => format(addWeeks(new Date(), 1), 'EEE, MMM d'),
        getDate: () => addWeeks(new Date(), 1) 
    },
    { 
        label: 'Next weekend', 
        getDateFormat: () => format(addWeeks(new Date(), 1), 'd MMM'),
        getDate: () => addWeeks(new Date(), 1) 
    },
    { 
        label: '2 weeks', 
        getDateFormat: () => format(addWeeks(new Date(), 2), 'd MMM'),
        getDate: () => addWeeks(new Date(), 2) 
    },
    { 
        label: '4 weeks', 
        getDateFormat: () => format(addWeeks(new Date(), 4), 'd MMM'),
        getDate: () => addWeeks(new Date(), 4) 
    },
];

type QuickOption = typeof _quickDateOptions[number];

const dedupeByDate = <T extends QuickOption>(options: readonly T[]): T[] => {
  const seen = new Set<string>(); // ISO strings are safe for day-level comparison
  return options.filter((opt) => {
    if ( opt.label == `Later` ) return true;
    const iso = opt.getDate().toISOString().split('T')[0]; // "2025-10-31"
    if (seen.has(iso)) return false;
    seen.add(iso);
    return true;
  });
}

const normalizeDisabledDateInput = (input: CalendarDisabledDateInput): Date | null => {
        if (input instanceof Date) {
            return isValid(input) ? input : null;
        }

        const nativeDate = new Date(input);
        if (isValid(nativeDate)) return nativeDate;

        const fallbackFormats = [
            "yyyy-MM-dd",
            "MM-dd-yyyy",
            "MM/dd/yyyy",
            "dd-MM-yyyy",
            "dd/MM/yyyy",
        ];

        for (const dateFormat of fallbackFormats) {
            const parsedDate = parse(input, dateFormat, new Date());
            if (isValid(parsedDate)) return parsedDate;
        }

        return null;
}

const quickOptionLabelSet = new Set<CalendarQuickOptionLabel>(_quickDateOptions.map((option) => option.label as CalendarQuickOptionLabel));

const normalizeQuickOptionFilters = (
    input: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[] | undefined,
) => {
    if (input === true) return true;
    if (!input) return null;

    const hiddenLabels = new Set<string>();
    const hiddenDates = new Set<string>();
    const values = Array.isArray(input) ? input : [input];

    values.forEach((value) => {
        if (value instanceof Date) {
            const normalizedDate = normalizeDisabledDateInput(value);
            if (normalizedDate) {
                hiddenDates.add(startOfDay(normalizedDate).toISOString().split("T")[0]);
            }
            return;
        }

        const normalizedText = String(value).trim();
        if (!normalizedText) return;

        if (quickOptionLabelSet.has(normalizedText as CalendarQuickOptionLabel)) {
            hiddenLabels.add(normalizedText.toLowerCase());
            return;
        }

        const normalizedDate = normalizeDisabledDateInput(normalizedText);
        if (normalizedDate) {
            hiddenDates.add(startOfDay(normalizedDate).toISOString().split("T")[0]);
        }
    });

    return { hiddenLabels, hiddenDates };
}

/**
 * Calendar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} selected={new Date()} minDate={new Date(2024, 0, 1)} maxDate={new Date()} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param selected - Currently selected item/date
 * @param minDate - minDate prop
 * @param maxDate - maxDate prop
 */
const Calendar = forwardRef<HTMLInputElement, CalendarProps>((props, ref) => {

    const {
        value,
        defaultValue,
        minDate,
        maxDate,
        disabledDates,
        disableQuickOptions,
        range,
        rangeValue,
        defaultRangeValue,
        variant,
        onChange,
        onRangeChange,
        ...pops
    } = props

    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)
    const { variant: themeVariant } = useTheme(true)!
    const isRangeMode = !!range;
    const [current, setCurrent] = useState(value ?? defaultValue ?? new Date());
    const [visibleMonth, setVisibleMonth] = useState(startOfMonth(value ?? defaultValue ?? new Date()));
    const [currentRange, setCurrentRange] = useState<CalendarRangeValue>(
        rangeValue ?? defaultRangeValue ?? { start: null, end: null }
    );

    useEffect(() => {
        if (typeof value !== "undefined") {
            const nextDate = value ?? new Date();
            setCurrent(nextDate);
            setVisibleMonth(startOfMonth(nextDate));
        }
    }, [value]);

    useEffect(() => {
        if (typeof rangeValue !== "undefined") {
            setCurrentRange(rangeValue);
        }
    }, [rangeValue]);

    const minDateDay = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
    const maxDateDay = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);
    const disabledDateSet = useMemo(() => {
        const set = new Set<string>();
        const values = Array.isArray(disabledDates)
            ? disabledDates
            : disabledDates != null
                ? [disabledDates]
                : [];

        values.forEach((value) => {
            const date = normalizeDisabledDateInput(value);
            if (!date) return;
            set.add(startOfDay(date).toISOString().split('T')[0]);
        });
        return set;
    }, [disabledDates]);
    const hiddenQuickOptionFilters = useMemo(() => {
        return normalizeQuickOptionFilters(disableQuickOptions);
    }, [disableQuickOptions]);

    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = useMemo(() => 
        eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]);

    const isDateDisabled = (date: Date) => {
        const day = startOfDay(date);
        const dayKey = day.toISOString().split('T')[0];
        if (disabledDateSet.has(dayKey)) return true;
        if (minDateDay && isBefore(day, minDateDay)) return true;
        if (maxDateDay && isAfter(day, maxDateDay)) return true;
        return false;
    };

    const findSelectableDateInMonth = (monthDate: Date, preferredDay: number) => {
        const monthStartDate = startOfMonth(monthDate);
        const monthEndDate = endOfMonth(monthDate);
        const maxDay = monthEndDate.getDate();
        const normalizedPreferredDay = Math.min(Math.max(1, preferredDay || 1), maxDay);
        const maxOffset = Math.max(normalizedPreferredDay - 1, maxDay - normalizedPreferredDay);

        for (let offset = 0; offset <= maxOffset; offset += 1) {
            const previousDay = normalizedPreferredDay - offset;
            if (previousDay >= 1) {
                const previousCandidate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), previousDay);
                if (!isDateDisabled(previousCandidate)) {
                    return previousCandidate;
                }
            }

            if (offset === 0) continue;

            const nextDay = normalizedPreferredDay + offset;
            if (nextDay <= maxDay) {
                const nextCandidate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), nextDay);
                if (!isDateDisabled(nextCandidate)) {
                    return nextCandidate;
                }
            }
        }

        return null;
    };

    const visibleQuickOptions = useMemo(() => {
        if (hiddenQuickOptionFilters === true) return [];

        return dedupeByDate(_quickDateOptions).filter((option) => {
            if (!hiddenQuickOptionFilters) return true;

            const optionDayKey = startOfDay(option.getDate()).toISOString().split("T")[0];
            if (hiddenQuickOptionFilters.hiddenLabels.has(option.label.trim().toLowerCase())) return false;
            if (hiddenQuickOptionFilters.hiddenDates.has(optionDayKey)) return false;
            return true;
        });
    }, [hiddenQuickOptionFilters]);

    const showQuickOptions = visibleQuickOptions.length > 0;

    
    const calendarRootClassName = [
        `--calendar`,
        `--${variant || themeVariant || Variant.Small}`,
        className,
        !showQuickOptions ? `--calendar-no-quick-options` : ``,
    ].filter(Boolean).join(` `);

    const handleDateClick = (date: Date) => {
        if (isDateDisabled(date)) return;

        if (isRangeMode) {
            const { start, end } = currentRange;
            const selectedDay = startOfDay(date);
            const startDay = start ? startOfDay(start) : null;
            let nextRange: CalendarRangeValue;

            if (!start || (start && end)) {
                nextRange = { start: date, end: null };
            } else if (startDay && isBefore(selectedDay, startDay)) {
                nextRange = { start: date, end: start };
            } else {
                nextRange = { start, end: date };
            }

            setCurrentRange(nextRange);
            onRangeChange?.(nextRange);
            setCurrent(date);
            setVisibleMonth(startOfMonth(date));
            return;
        }

        onChange?.(date, { source: "day" });
        setCurrent(date);
        setVisibleMonth(startOfMonth(date));
    };

    const gotoPrevMonth = () => {
        setVisibleMonth((prevVisibleMonth) => {
            const nextVisibleMonth = startOfMonth(new Date(prevVisibleMonth.getFullYear(), prevVisibleMonth.getMonth() - 1, 1));

            if (!isRangeMode) {
                const preferredDay = current.getDate();
                const nextDate = findSelectableDateInMonth(nextVisibleMonth, preferredDay);

                if (nextDate) {
                    setCurrent(nextDate);
                    onChange?.(nextDate, { source: "month" });
                } else {
                    onChange?.(null, { source: "month" });
                }
            }

            return nextVisibleMonth;
        });
    };

    const gotoNextMonth = () => {
        setVisibleMonth((prevVisibleMonth) => {
            const nextVisibleMonth = startOfMonth(new Date(prevVisibleMonth.getFullYear(), prevVisibleMonth.getMonth() + 1, 1));

            if (!isRangeMode) {
                const preferredDay = current.getDate();
                const nextDate = findSelectableDateInMonth(nextVisibleMonth, preferredDay);

                if (nextDate) {
                    setCurrent(nextDate);
                    onChange?.(nextDate, { source: "month" });
                } else {
                    onChange?.(null, { source: "month" });
                }
            }

            return nextVisibleMonth;
        });
    };

    const prevMonthEnd = endOfMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1));
    const nextMonthStart = startOfMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));
    const disablePrevMonth = !!minDateDay && isBefore(prevMonthEnd, minDateDay);
    const disableNextMonth = !!maxDateDay && isAfter(nextMonthStart, maxDateDay);

    const rawRangeStart = currentRange.start ? startOfDay(currentRange.start) : null;
    const rawRangeEnd = currentRange.end ? startOfDay(currentRange.end) : null;
    const rangeStart = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeEnd : rawRangeStart;
    const rangeEnd = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeStart : rawRangeEnd;

    return <Flex
        as={calendarRootClassName}
        style={style}>
        {showQuickOptions && <Box as={`--calendar-quick-select flex cols flex:1`}>
            {visibleQuickOptions.map((option) => {
                const date = option.getDate();
                return <Button 
                    key={`--dtp-option-label-${option.label}`} 
                    onClick={() => handleDateClick(date)}
                    as={[
                        `--calendar-quick-option flex aic gap:5`,
                    ]}>
                    <Text as={`flex:1`}>{option.label}</Text>
                    <Text as={`tar dim-50`}>{option.getDateFormat()}</Text>
                </Button>
            })}
        </Box>}
        {/* `${isSameDay(date, current) && option.label != `Later` ? `--calendar-quick-option-selected` : ``}`, */}
        <Box as={`--calendar-selector flex cols flex:1`}>
            <Box as={`--calendar-head flex aic jcc gap:4`}>
                <Text as={`flex:1 --calendar-cm bold`}>{format(visibleMonth, 'MMMM yyyy')}</Text>
                <Button 
                    disabled={disablePrevMonth}
                    onClick={gotoPrevMonth}
                    as={`--calendar-chevron`}>{SVGIcons.chevronUpOutline}</Button>
                <Button 
                    disabled={disableNextMonth}
                    onClick={gotoNextMonth}
                    as={`--calendar-chevron`}>{SVGIcons.chevronDownOutline}</Button>
            </Box>
            <Box as={`--calendar-days gap:4`}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <Text key={`--calendar-hd-${day}`} as={`--calendar-day`}>{day}</Text>)}
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, visibleMonth);
                    const isDisabled = !isCurrentMonth || isDateDisabled(day);
                    const isSelected = !isDisabled && isSameDay(day, current);
                    const isCurrentDay = isToday(day);
                    const isRangeStart = !!rangeStart && isSameDay(day, rangeStart);
                    const isRangeEnd = !!rangeEnd && isSameDay(day, rangeEnd);
                    const isRangeDay = !!rangeStart && !!rangeEnd && isWithinInterval(day, { start: rangeStart, end: rangeEnd });
                    const isMiddleRangeDay = isRangeDay && !isRangeStart && !isRangeEnd;
                    return <Button 
                        key={`--calendar-day-${idx}-${day.getFullYear()}-${day.getMonth()}-${day.getDay()}`}
                        disabled={isDisabled}
                        onClick={() => handleDateClick(day)}
                        variant={variant || themeVariant || Variant.Small}
                        as={[
                            `--calendar-day --calendar-dd`,
                            `${!isRangeMode && isSelected ? `--calendar-dd-selected` : ``}`,
                            `${isRangeMode && (isRangeStart || isRangeEnd) ? `--calendar-dd-selected` : ``}`,
                            `${isRangeMode && isRangeStart ? `--calendar-dd-range-start` : ``}`,
                            `${isRangeMode && isRangeEnd ? `--calendar-dd-range-end` : ``}`,
                            `${isRangeMode && isMiddleRangeDay ? `--calendar-dd-range` : ``}`,
                            `${isCurrentDay ? `--calendar-dd-current` : ``}`,
                        ]}>{format(day, 'd')}</Button>
                })}
            </Box>
            {/* Calendar dates would go here */}
        </Box>
    </Flex>
})

Calendar.displayName = `Zuz.Calendar`

export default Calendar