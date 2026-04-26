import { addDays, addHours, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isToday, isWithinInterval, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { forwardRef, useEffect, useMemo, useState } from "react";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarProps, CalendarRangeValue } from "./types";

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
    const [currentRange, setCurrentRange] = useState<CalendarRangeValue>(
        rangeValue ?? defaultRangeValue ?? { start: null, end: null }
    );

    useEffect(() => {
        if (typeof value !== "undefined") {
            setCurrent(value ?? new Date());
        }
    }, [value]);

    useEffect(() => {
        if (typeof rangeValue !== "undefined") {
            setCurrentRange(rangeValue);
        }
    }, [rangeValue]);

    const minDateDay = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
    const maxDateDay = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);

    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = useMemo(() => 
        eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]);

    const isDateDisabled = (date: Date) => {
        const day = startOfDay(date);
        if (minDateDay && isBefore(day, minDateDay)) return true;
        if (maxDateDay && isAfter(day, maxDateDay)) return true;
        return false;
    };

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
            return;
        }

        onChange?.(date);
        setCurrent(date);
    };

    const gotoPrevMonth = () => {
        setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const gotoNextMonth = () => {
        setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    const prevMonthEnd = endOfMonth(new Date(current.getFullYear(), current.getMonth() - 1, 1));
    const nextMonthStart = startOfMonth(new Date(current.getFullYear(), current.getMonth() + 1, 1));
    const disablePrevMonth = !!minDateDay && isBefore(prevMonthEnd, minDateDay);
    const disableNextMonth = !!maxDateDay && isAfter(nextMonthStart, maxDateDay);

    const rawRangeStart = currentRange.start ? startOfDay(currentRange.start) : null;
    const rawRangeEnd = currentRange.end ? startOfDay(currentRange.end) : null;
    const rangeStart = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeEnd : rawRangeStart;
    const rangeEnd = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeStart : rawRangeEnd;

    return <Box 
        as={`--calendar flex --${variant || themeVariant || Variant.Small} ${className}`}
        style={style}>
        <Box as={`--calendar-quick-select flex cols flex:1`}>
            {dedupeByDate(_quickDateOptions)
                .map((option) => {
                const date = option.getDate();
                const disabled = isDateDisabled(date);
                return <Button 
                    key={`--dtp-option-label-${option.label}`} 
                    disabled={disabled}
                    onClick={() => handleDateClick(date)}
                    as={[
                        `--calendar-quick-option flex aic gap:5`,
                    ]}>
                    <Text as={`flex:1`}>{option.label}</Text>
                    <Text as={`tar dim-50`}>{option.getDateFormat()}</Text>
                </Button>
            })}
        </Box>
        {/* `${isSameDay(date, current) && option.label != `Later` ? `--calendar-quick-option-selected` : ``}`, */}
        <Box as={`--calendar-selector flex cols flex:1`}>
            <Box as={`--calendar-head flex aic jcc gap:4`}>
                <Text as={`flex:1 --calendar-cm bold`}>{format(current, 'MMMM yyyy')}</Text>
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
                    const isCurrentMonth = isSameMonth(day, current);
                    const isSelected = isSameDay(day, current);
                    const isCurrentDay = isToday(day);
                    const isDisabled = !isCurrentMonth || isDateDisabled(day);
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
    </Box>
})

Calendar.displayName = `Zuz.Calendar`

export default Calendar