import { addDays, addMinutes, addWeeks, endOfWeek, format, isAfter, isBefore, isSameDay, isToday, setHours, setMinutes, startOfDay, startOfWeek } from "date-fns";
import Button from "../Button";
import Flex from "../Flex";
import Select from "../Select";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarViewMode, CalendarWeekStartDay, LargeCalendarProps } from "./types";
import React, { useCallback, useMemo } from "react";
import Segmented from "../Segmented";
import { Variant } from "../../types";
import Grid from "../Grid";
type TimeSlot = {
    hour: number;
    minute: number;
    label: string;
    isMainSlot: boolean;
}

// Render view mode selector options
const viewModeOptions = [
    { label: 'Week', value: 'week' },
    { label: 'Month', value: 'month' },
    { label: 'Year', value: 'year' }
];

const getMaxAllowedDate = (disableAfter?: 'today' | 'next-week' | Date): Date | null => {
    if (!disableAfter) return null;
    
    const today = startOfDay(new Date());
    
    switch (disableAfter) {
        case 'today':
            return today;
        case 'next-week':
            return addDays(today, 7);
        default:
            return startOfDay(disableAfter);
    }
};

const getViewLabel = (date: Date, viewMode: CalendarViewMode, weekStartsOn: CalendarWeekStartDay): string => {
    switch (viewMode) {
        case 'week': {
            const start = startOfWeek(date, { weekStartsOn });
            const end = endOfWeek(date, { weekStartsOn });
            return `${format(start, 'MMM d')} - ${format(end, 'MMM d, yyyy')}`;
        }
        case 'month':
            return format(date, 'MMMM yyyy');
        case 'year':
            return format(date, 'yyyy');
        default:
            return '';
    }
};

const getDaysInView = (date: Date, viewMode: CalendarViewMode, weekStartsOn: CalendarWeekStartDay): Date[] => {
    switch (viewMode) {
        case 'week': {
            const start = startOfWeek(date, { weekStartsOn });
            const end = endOfWeek(date, { weekStartsOn });
            const days: Date[] = [];
            let current = start;
            while (current <= end) {
                days.push(new Date(current));
                current = addDays(current, 1);
            }
            return days;
        }
        case 'month': {
            const start = new Date(date.getFullYear(), date.getMonth(), 1);
            const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            const days: Date[] = [];
            let current = start;
            while (current <= end) {
                days.push(new Date(current));
                current = addDays(current, 1);
            }
            return days;
        }
        case 'year': {
            const months: Date[] = [];
            for (let i = 0; i < 12; i++) {
                months.push(new Date(date.getFullYear(), i, 1));
            }
            return months;
        }
        default:
            return [];
    }
};

const formatTimeLabel = (hour: number, minute: number): string => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
};

type CalendarColumnBase = {
    subInterval: number;
    showSubIntervalLabel: boolean;
    subTimeSlots: TimeSlot[];
}
type CalendarColumnProps = | {
        type: "stamps";
        mainTimeSlots: TimeSlot[];
        rowCount: number;
        index?: never;
        day?: never,
        disabled?: never;
        value?: never;
        
    }
    | {
        type: "meta";
        index: number;
        day: Date,
        disabled: boolean;
        value: Date | null | undefined;
        rowCount: number;
        mainTimeSlots?: TimeSlot[];
    }

const CalendarColumn : React.FC<CalendarColumnBase & CalendarColumnProps> = ({
    type,
    index,
    day,
    disabled,
    value,
    rowCount,
    mainTimeSlots,
    subTimeSlots,
    subInterval,
    showSubIntervalLabel
}) => {

    return <Flex cols>

    { type == `stamps` ? 
        <Flex
            gap={4}
            as={`--day-header --calendar-column flex aic jcc`} />
        : <Flex
            gap={4}
            as={`--day-header --calendar-column flex aic jcc ${isToday(day) ? '--today' : ''} ${disabled ? '--disabled' : ''}`}>
            <Text as="--day-name">{format(day, 'EEE')}</Text>
            <Text as={`--day-number ${isSameDay(day, value || new Date()) ? '--selected' : ''}`}>
                {format(day, 'd')}
            </Text>
        </Flex> }

        { new Array(rowCount).fill({}).map((slot, idx) => {
            if ( type == `stamps` ){
                return  <>
                    <Flex
                        key={`time-slot-${idx}`}
                        aic jce
                        as="--time-label --calendar-column --time-column">
                        <Text as="--time-text">{mainTimeSlots[idx].label}</Text>
                    </Flex>
                    {subTimeSlots.map(st => <Flex
                        key={`time-slot-${idx}`}
                        as="--time-label --calendar-column --time-column">
                        
                    </Flex>)}
                </>
            }

            return <>
                <Flex
                    key={`time-slot-${idx}`}
                    as="--calendar-column --time-column">
                    
                </Flex>
                {subTimeSlots.map(st => <Flex
                    key={`time-slot-${idx}`}
                    as="--calendar-column --time-column">
                    
                </Flex>)}
            </>

        })}

    </Flex>
}

const LargeCalendar = (props: LargeCalendarProps) => {

    const {
        viewMode = `week`,
        weekStartsOn = 1,
        themeVariant,
        startDate,
        visibleMonth,
        disableAfter,
        startHour = 8,
        endHour = 20,
        timeInterval = 60,
        subInterval = 15,
        showSubIntervalLabel = false,
        value
    } = props

    // Determine the reference date for the view
    const referenceDate = useMemo(() => {
        return startDate || visibleMonth || value || new Date();
    }, [startDate, visibleMonth, value]);

    // Get days to display
    const daysInView = useMemo(() => getDaysInView(referenceDate, viewMode, weekStartsOn), [referenceDate, viewMode, weekStartsOn]);

    // Get max allowed date
    const maxAllowedDate = useMemo(() => getMaxAllowedDate(disableAfter), [disableAfter]);

    // Determine if we have sub-intervals
    const hasSubIntervals = subInterval && subInterval < timeInterval;
    const effectiveSubInterval = hasSubIntervals ? subInterval! : timeInterval;

    // Check if a day is disabled
    const isDayDisabled = useCallback((day: Date): boolean => {
        if (!maxAllowedDate) return false;
        return isAfter(startOfDay(day), maxAllowedDate);
    }, [maxAllowedDate]);

    // Generate main time slots (for labels in the time column)
    const mainTimeSlots : TimeSlot[] = useMemo(() => {
        const slots: TimeSlot[] = [];
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += timeInterval) {
                slots.push({
                    hour: h,
                    minute: m,
                    label: formatTimeLabel(h, m),
                    isMainSlot: false
                });
            }
        }
        return slots;
    }, [startHour, endHour, timeInterval]);

    // Generate sub time slots (for clickable cells)
    const subTimeSlots : TimeSlot[] = useMemo(() => {

        return new Array(Math.round(timeInterval / subInterval) - 1).fill({}).map(m => ({
            hour: 9,
            minute: 15,
            label: formatTimeLabel(9, 15),
            isMainSlot: false
        }))

    }, [startHour, endHour, timeInterval, effectiveSubInterval]);

    return <Flex as={`--large-calendar --${themeVariant} flex cols`}>
        
        {/* Header */}
        <Flex as="--large-calendar-header flex aic jcb">
                
            <Flex aic gap={8} as={`flex:1`}>
                <Text as="--calendar-range bold">{getViewLabel(referenceDate, viewMode, weekStartsOn)}</Text>
            </Flex>
                
            <Flex aic jcc gap={8} as={`flex:1`}>
                <Segmented 
                    variant={Variant.Small}
                    items={[
                        { label: `Day`, tag: `day` },
                        { label: `Week`, tag: `week` },
                        { label: `Month`, tag: `month` },
                        { label: `Year`, tag: `year` },
                    ]}
                    onSwitch={(seg) => {}}
                    />
            </Flex>

            <Flex aic jce gap={4} as={`flex:1`}>
                <Button
                    // kind="ghost"
                    variant={props.variant || themeVariant}
                    // onClick={gotoPrev}
                    as="--nav-btn"
                >
                    {SVGIcons.chevronLeftOutline}
                </Button>
                <Button
                    // kind="ghost"
                    variant={props.variant || themeVariant}
                    // onClick={gotoToday}
                    as="--today-btn">Today</Button>
                <Button
                    // kind="ghost"
                    variant={props.variant || themeVariant}
                    // onClick={gotoNext}
                    as="--nav-btn"
                >
                    {SVGIcons.chevronRightOutline}
                </Button>
            </Flex>
 
        </Flex>

        <Grid
            cols={`repeat(8, 1fr)`}
            // rows="var(--large-calendar-sub-head, ) 1fr"
            as="--large-calendar-grid">

            <CalendarColumn 
                type={`stamps`}
                rowCount={mainTimeSlots.length}
                mainTimeSlots={mainTimeSlots}
                subTimeSlots={subTimeSlots}
                subInterval={subInterval}
                showSubIntervalLabel={showSubIntervalLabel} />

            {daysInView.map((day, idx) => <CalendarColumn 
                type={`meta`}
                key={`lgc-${idx}-${day}-${viewMode}`}
                index={idx}
                day={day}
                rowCount={mainTimeSlots.length}
                disabled={isDayDisabled(day)}
                subTimeSlots={subTimeSlots}
                subInterval={subInterval}
                showSubIntervalLabel={showSubIntervalLabel}
                value={value}
            />)}

        </Grid>


    </Flex>
}

export default LargeCalendar