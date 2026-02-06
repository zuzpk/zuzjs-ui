import { addDays, addHours, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from "date-fns";
import { forwardRef, useMemo, useState } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import Button from "../Button";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarProps } from "./types";

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

const Calendar = forwardRef<HTMLInputElement, CalendarProps>((props, ref) => {

    const { defaultValue, variant, onChange, ...pops } = props

    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)

    const [current, setCurrent] = useState(defaultValue || new Date());
    const monthStart = startOfMonth(current);
    const monthEnd = endOfMonth(current);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = useMemo(() => 
        eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]);

    const handleDateClick = (date: Date) => {
        onChange?.(date);
        setCurrent(date);
    };

    const gotoPrevMonth = () => {
        setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
    };

    const gotoNextMonth = () => {
        setCurrent(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
    };

    return <Box 
        as={`--calendar flex --${variant || `sm`} ${className}`}
        style={style}>
        <Box as={`--calendar-quick-select flex cols flex:1`}>
            {dedupeByDate(_quickDateOptions)
                .map((option) => {
                const date = option.getDate();
                return <Button 
                    key={`--dtp-option-label-${option.label}`} 
                    onClick={() => handleDateClick(date)}
                    as={[
                        `--calendar-quick-option flex aic gap:5`,
                    ]}>
                    <Text as={`flex:1`}>{option.label}</Text>
                    <Text as={`tar`}>{option.getDateFormat()}</Text>
                </Button>
            })}
        </Box>
        {/* `${isSameDay(date, current) && option.label != `Later` ? `--calendar-quick-option-selected` : ``}`, */}
        <Box as={`--calendar-selector flex cols flex:1`}>
            <Box as={`--calendar-head flex aic jcc gap:4`}>
                <Text as={`flex:1 --calendar-cm bold`}>{format(current, 'MMMM yyyy')}</Text>
                <Button 
                    onClick={gotoPrevMonth}
                    as={`--calendar-chevron`}>{SVGIcons.chevronUpOutline}</Button>
                <Button 
                    onClick={gotoNextMonth}
                    as={`--calendar-chevron`}>{SVGIcons.chevronDownOutline}</Button>
            </Box>
            <Box as={`--calendar-days gap:4`}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => <Text key={`--calendar-hd-${day}`} as={`--calendar-day`}>{day}</Text>)}
                {days.map((day, idx) => {
                    const isCurrentMonth = isSameMonth(day, current);
                    const isSelected = isSameDay(day, current);
                    const isCurrentDay = isToday(day);
                    return <Button 
                        key={`--calendar-day-${idx}-${day.getFullYear()}-${day.getMonth()}-${day.getDay()}`}
                        disabled={!isCurrentMonth}
                        onClick={() => handleDateClick(day)}
                        as={[
                            `--calendar-day --calendar-dd`,
                            `${isSelected ? `--calendar-dd-selected` : ``}`,
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