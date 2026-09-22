"use client";
import { addDays, addMinutes, addWeeks, endOfWeek, format, isAfter, isBefore, isSameDay, isToday, setHours, setMinutes, startOfDay, startOfWeek } from "date-fns";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import Select from "../Select";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarAppointment, CalendarAppointmentRenderProps, CalendarProps, CalendarTimeRange, CalendarTimeSlot, CalendarViewMode, CalendarWeekStartDay } from "./types";

type LargeCalendarProps = Pick<CalendarProps,
    | 'value'
    | 'defaultValue'
    | 'variant'
    | 'viewMode'
    | 'startDate'
    | 'weekStartsOn'
    | 'timeInterval'
    | 'subInterval'
    | 'showSubIntervalLabel'
    | 'startHour'
    | 'endHour'
    | 'appointments'
    | 'renderAppointment'
    | 'onTimeSlotClick'
    | 'onAppointmentClick'
    | 'enableRangeSelect'
    | 'onTimeRangeSelect'
    | 'disableAfter'
> & {
    visibleMonth: Date;
    themeVariant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null) => void;
    setVisibleMonth: (date: Date) => void;
};

const DEFAULT_TIME_SLOT_HEIGHT = 48; // px per hour slot
const HEADER_HEIGHT = 50;
const TIME_COLUMN_WIDTH = 80;

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

const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
};

const formatTimeLabel = (hour: number, minute: number): string => {
    const h = hour.toString().padStart(2, '0');
    const m = minute.toString().padStart(2, '0');
    return `${h}:${m}`;
};

// Helper to get the max allowed date based on disableAfter prop
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

const LargeCalendar = (props: LargeCalendarProps) => {
    const {
        value,
        visibleMonth,
        themeVariant,
        viewMode = 'week',
        startDate,
        weekStartsOn = 1, // Default: Monday
        timeInterval = 60,
        subInterval,
        showSubIntervalLabel = false,
        startHour = 8,
        endHour = 20,
        appointments = [],
        renderAppointment,
        onTimeSlotClick,
        onAppointmentClick,
        enableRangeSelect = false,
        onTimeRangeSelect,
        disableAfter,
        setVisibleMonth
    } = props;

    // Track drag selection state
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState<{ day: Date; slot: { hour: number; minute: number } } | null>(null);
    const [dragEnd, setDragEnd] = useState<{ day: Date; slot: { hour: number; minute: number } } | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Determine the reference date for the view
    const referenceDate = useMemo(() => {
        return startDate || visibleMonth || value || new Date();
    }, [startDate, visibleMonth, value]);

    // Determine if we have sub-intervals
    const hasSubIntervals = subInterval && subInterval < timeInterval;
    const effectiveSubInterval = hasSubIntervals ? subInterval! : timeInterval;

    // Get max allowed date
    const maxAllowedDate = useMemo(() => getMaxAllowedDate(disableAfter), [disableAfter]);

    // Generate main time slots (for labels in the time column)
    const mainTimeSlots = useMemo(() => {
        const slots: { hour: number; minute: number; label: string }[] = [];
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += timeInterval) {
                slots.push({
                    hour: h,
                    minute: m,
                    label: formatTimeLabel(h, m)
                });
            }
        }
        return slots;
    }, [startHour, endHour, timeInterval]);

    // Generate sub time slots (for clickable cells)
    const subTimeSlots = useMemo(() => {
        const slots: { hour: number; minute: number; label: string; isMainSlot: boolean }[] = [];
        for (let h = startHour; h < endHour; h++) {
            // Calculate how many sub-slots fit in a main interval
            const subSlotsPerInterval = Math.floor(timeInterval / effectiveSubInterval);
            
            // Iterate through main intervals
            for (let mainM = 0; mainM < 60; mainM += timeInterval) {
                // For each main interval, create sub-intervals
                for (let subOffset = 0; subOffset < subSlotsPerInterval; subOffset++) {
                    const minute = mainM + (subOffset * effectiveSubInterval);
                    if (minute < 60) {
                        slots.push({
                            hour: h,
                            minute,
                            label: formatTimeLabel(h, minute),
                            isMainSlot: minute === mainM || minute % timeInterval === 0
                        });
                    }
                }
            }
        }
        return slots;
    }, [startHour, endHour, timeInterval, effectiveSubInterval]);

    // Get days to display
    const daysInView = useMemo(() => getDaysInView(referenceDate, viewMode, weekStartsOn), [referenceDate, viewMode, weekStartsOn]);

    // Calculate slot height based on sub-interval
    const slotHeight = useMemo(() => {
        const hourFraction = effectiveSubInterval / 60;
        return DEFAULT_TIME_SLOT_HEIGHT * hourFraction;
    }, [effectiveSubInterval]);

    // Height for main slot row (containing sub-slots)
    const mainSlotHeight = useMemo(() => {
        const hourFraction = timeInterval / 60;
        return DEFAULT_TIME_SLOT_HEIGHT * hourFraction;
    }, [timeInterval]);

    // Group appointments by date
    const appointmentsByDate = useMemo(() => {
        const map = new Map<string, typeof appointments>();
        appointments.forEach(apt => {
            const dateKey = format(apt.date, 'yyyy-MM-dd');
            const existing = map.get(dateKey) || [];
            map.set(dateKey, [...existing, apt]);
        });
        return map;
    }, [appointments]);

    // Check if a day is disabled
    const isDayDisabled = useCallback((day: Date): boolean => {
        if (!maxAllowedDate) return false;
        return isAfter(startOfDay(day), maxAllowedDate);
    }, [maxAllowedDate]);

    // Navigate to previous period
    const gotoPrev = () => {
        switch (viewMode) {
            case 'week':
                setVisibleMonth(addWeeks(referenceDate, -1));
                break;
            case 'month':
                setVisibleMonth(new Date(referenceDate.getFullYear(), referenceDate.getMonth() - 1, 1));
                break;
            case 'year':
                setVisibleMonth(new Date(referenceDate.getFullYear() - 1, 0, 1));
                break;
        }
    };

    // Navigate to next period
    const gotoNext = () => {
        switch (viewMode) {
            case 'week':
                setVisibleMonth(addWeeks(referenceDate, 1));
                break;
            case 'month':
                setVisibleMonth(new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 1));
                break;
            case 'year':
                setVisibleMonth(new Date(referenceDate.getFullYear() + 1, 0, 1));
                break;
        }
    };

    // Go to today
    const gotoToday = () => {
        setVisibleMonth(new Date());
    };

    // Handle cell click
    const handleCellClick = (day: Date, slot: typeof subTimeSlots[0]) => {
        if (isDayDisabled(day)) return;
        
        if (onTimeSlotClick) {
            const dateWithTime = setMinutes(setHours(day, slot.hour), slot.minute);
            const endTime = format(addMinutes(dateWithTime, effectiveSubInterval), 'HH:mm');
            onTimeSlotClick({
                date: dateWithTime,
                timeStart: slot.label,
                timeEnd: endTime
            });
        }
    };

    // Handle mouse down for range selection
    const handleMouseDown = (day: Date, slot: typeof subTimeSlots[0]) => {
        if (!enableRangeSelect || isDayDisabled(day)) return;
        
        setIsDragging(true);
        setDragStart({ day, slot });
        setDragEnd({ day, slot });
    };

    // Handle mouse move during drag
    const handleMouseEnter = (day: Date, slot: typeof subTimeSlots[0]) => {
        if (!isDragging || !enableRangeSelect) return;
        if (isDayDisabled(day)) return;
        
        setDragEnd({ day, slot });
    };

    // Handle mouse up to complete selection
    const handleMouseUp = () => {
        if (!isDragging || !dragStart || !dragEnd || !enableRangeSelect) {
            setIsDragging(false);
            setDragStart(null);
            setDragEnd(null);
            return;
        }

        // Create time slots for start and end
        const startDateWithTime = setMinutes(setHours(dragStart.day, dragStart.slot.hour), dragStart.slot.minute);
        const endDateWithTime = setMinutes(setHours(dragEnd.day, dragEnd.slot.hour), dragEnd.slot.minute);

        // Ensure start is before end
        let start = startDateWithTime;
        let end = endDateWithTime;
        if (isAfter(start, end)) {
            [start, end] = [end, start];
        }

        // Add the subInterval to the end time to include the full slot
        const endPlusInterval = addMinutes(end, effectiveSubInterval);

        const startSlot: CalendarTimeSlot = {
            date: start,
            timeStart: format(start, 'HH:mm'),
            timeEnd: format(addMinutes(start, effectiveSubInterval), 'HH:mm')
        };

        const endSlot: CalendarTimeSlot = {
            date: end,
            timeStart: format(end, 'HH:mm'),
            timeEnd: format(endPlusInterval, 'HH:mm')
        };

        onTimeRangeSelect?.({
            start: startSlot,
            end: endSlot
        });

        setIsDragging(false);
        setDragStart(null);
        setDragEnd(null);
    };

    // Check if a cell is in the selected range
    const isCellInRange = (day: Date, slot: typeof subTimeSlots[0]): boolean => {
        if (!isDragging || !dragStart || !dragEnd) return false;

        const cellTime = setMinutes(setHours(day, slot.hour), slot.minute);
        const startTime = setMinutes(setHours(dragStart.day, dragStart.slot.hour), dragStart.slot.minute);
        const endTime = setMinutes(setHours(dragEnd.day, dragEnd.slot.hour), dragEnd.slot.minute);

        const min = isBefore(startTime, endTime) ? startTime : endTime;
        const max = isBefore(startTime, endTime) ? endTime : startTime;

        return !isBefore(cellTime, min) && !isAfter(cellTime, max);
    };

    // Default appointment render
    const defaultRenderAppointment = (renderProps: CalendarAppointmentRenderProps): ReactNode => {
        const { appointment, style } = renderProps;
        return (
            <Box
                key={`apt-${appointment.id}`}
                as="--large-calendar-appointment"
                style={style}
                onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    onAppointmentClick?.(appointment);
                }}
            >
                <Text as="--appointment-title">{appointment.title || 'Event'}</Text>
            </Box>
        );
    };

    // Calculate appointment position and height
    const getAppointmentStyle = (appointment: CalendarAppointment): React.CSSProperties | null => {
        const startMinutes = parseTimeToMinutes(appointment.timeStart);
        const endMinutes = parseTimeToMinutes(appointment.timeEnd);
        
        // Check if appointment is within visible hours
        if (startMinutes < startHour * 60 || endMinutes > endHour * 60) {
            return null;
        }

        const minutesFromStart = startMinutes - startHour * 60;
        const duration = endMinutes - startMinutes;
        
        const top = (minutesFromStart / 60) * DEFAULT_TIME_SLOT_HEIGHT;
        const height = (duration / 60) * DEFAULT_TIME_SLOT_HEIGHT;

        return {
            top: `${top}px`,
            height: `${height}px`,
            left: '4px',
            right: '4px',
            position: 'absolute' as const,
            zIndex: 5
        };
    };

    // Render view mode selector options
    const viewModeOptions = [
        { label: 'Week', value: 'week' },
        { label: 'Month', value: 'month' },
        { label: 'Year', value: 'year' }
    ];

    const gridTemplateColumns = viewMode !== 'year' 
        ? `${TIME_COLUMN_WIDTH}px repeat(${daysInView.length}, 1fr)`
        : 'none';

    return (
        <Flex as={`--large-calendar --${themeVariant} flex cols`} style={{ width: '100%', height: '100%', minHeight: 0 }}>
            {/* Header */}
            <Flex as="--large-calendar-header flex aic jcb" style={{ flexShrink: 0, minHeight: HEADER_HEIGHT }}>
                <Flex aic gap={8}>
                    <Button
                        kind="ghost"
                        variant={props.variant || themeVariant}
                        onClick={gotoToday}
                        as="--today-btn"
                    >
                        Today
                    </Button>
                </Flex>
                
                <Flex aic gap={8}>
                    <Button
                        kind="ghost"
                        variant={props.variant || themeVariant}
                        onClick={gotoPrev}
                        as="--nav-btn"
                    >
                        {SVGIcons.chevronLeftOutline}
                    </Button>
                    <Text as="--calendar-range bold">{getViewLabel(referenceDate, viewMode, weekStartsOn)}</Text>
                    <Button
                        kind="ghost"
                        variant={props.variant || themeVariant}
                        onClick={gotoNext}
                        as="--nav-btn"
                    >
                        {SVGIcons.chevronRightOutline}
                    </Button>
                </Flex>

                <Select
                    options={viewModeOptions}
                    selected={viewMode}
                    onChange={(opt) => {
                        // View mode change would need to be handled by parent
                    }}
                    variant={props.variant || themeVariant}
                    kind="surface"
                />
            </Flex>

            {/* Grid Container */}
            <Box 
                ref={gridRef}
                as="--large-calendar-grid" 
                style={{ flex: '1 1 0%', overflow: 'auto', position: 'relative', minHeight: 0 }}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Day Headers Row */}
                {viewMode !== 'year' && (
                    <Box 
                        as="--large-calendar-days-header" 
                        style={{
                            display: 'grid',
                            gridTemplateColumns,
                            position: 'sticky',
                            top: 0,
                            zIndex: 10,
                            background: 'var(--large-calendar-header-bg)'
                        }}
                    >
                        {/* Empty corner for time column */}
                        <Box as="--corner" style={{ width: TIME_COLUMN_WIDTH }} />
                        
                        {/* Day headers */}
                        {daysInView.map((day, idx) => (
                            <Box
                                key={`day-header-${idx}`}
                                as={`--day-header flex cols aic jcc ${isToday(day) ? '--today' : ''} ${isDayDisabled(day) ? '--disabled' : ''}`}
                            >
                                <Text as="--day-name">{format(day, 'EEE')}</Text>
                                <Text as={`--day-number ${isSameDay(day, value || new Date()) ? '--selected' : ''}`}>
                                    {format(day, 'd')}
                                </Text>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Time Grid */}
                {viewMode !== 'year' && (
                    <Box 
                        as="--large-calendar-body"
                        style={{
                            display: 'grid',
                            gridTemplateColumns,
                            position: 'relative'
                        }}
                    >
                        {/* Time Column */}
                        <Box as="--time-column">
                            {mainTimeSlots.map((slot, idx) => (
                                <Box
                                    key={`time-slot-${idx}`}
                                    as="--time-label"
                                    style={{ height: mainSlotHeight }}
                                >
                                    <Text as="--time-text">{slot.label}</Text>
                                </Box>
                            ))}
                        </Box>

                        {/* Day Columns with time cells */}
                        {daysInView.map((day, dayIdx) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const dayAppointments = appointmentsByDate.get(dateKey) || [];
                            const dayDisabled = isDayDisabled(day);

                            return (
                                <Box
                                    key={`day-col-${dayIdx}`}
                                    as={`--day-column rel ${isToday(day) ? '--today' : ''} ${dayDisabled ? '--disabled' : ''}`}
                                    style={{ position: 'relative' }}
                                >
                                    {/* Time cells */}
                                    {subTimeSlots.map((slot, slotIdx) => {
                                        // Only show labels in cells if showSubIntervalLabel is true
                                        const showLabelInCell = showSubIntervalLabel && slot.isMainSlot;
                                        const inRange = isCellInRange(day, slot);
                                        
                                        return (
                                            <Box
                                                key={`cell-${dayIdx}-${slotIdx}`}
                                                as={`--time-cell ${slot.isMainSlot ? '--main-slot' : '--sub-slot'} ${inRange ? '--in-range' : ''}`}
                                                style={{ height: slotHeight }}
                                                onClick={() => !enableRangeSelect && handleCellClick(day, slot)}
                                                onMouseDown={() => handleMouseDown(day, slot)}
                                                onMouseEnter={() => handleMouseEnter(day, slot)}
                                            >
                                                {/* Render divider line for main slots */}
                                                {slot.isMainSlot && (
                                                    <Box as="--slot-divider" style={{ 
                                                        position: 'absolute', 
                                                        top: 0, 
                                                        left: 0, 
                                                        right: 0, 
                                                        height: '1px', 
                                                        background: 'var(--large-calendar-cell-border)' 
                                                    }} />
                                                )}
                                                {showLabelInCell && (
                                                    <Text as="--cell-time-label">{slot.label}</Text>
                                                )}
                                            </Box>
                                        );
                                    })}

                                    {/* Appointments layer - position absolute relative to day column */}
                                    <Box 
                                        as="--appointments-layer"
                                        style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: 0,
                                            right: 0,
                                            bottom: 0,
                                            pointerEvents: 'none'
                                        }}
                                    >
                                        {dayAppointments.map(apt => {
                                            const style = getAppointmentStyle(apt);
                                            if (!style) return null;

                                            const renderProps: CalendarAppointmentRenderProps = {
                                                appointment: apt,
                                                style: { ...style, pointerEvents: 'auto' } as React.CSSProperties,
                                                isDefault: !renderAppointment
                                            };

                                            return renderAppointment
                                                ? renderAppointment(renderProps)
                                                : defaultRenderAppointment(renderProps);
                                        })}
                                    </Box>
                                </Box>
                            );
                        })}
                    </Box>
                )}

                {/* Year View - Months Grid */}
                {viewMode === 'year' && (
                    <Flex as="--year-grid wrap" style={{ padding: 16, gap: 16 }}>
                        {daysInView.map((month, idx) => (
                            <Box
                                key={`month-${idx}`}
                                as={`--month-cell --${themeVariant}`}
                                onClick={() => setVisibleMonth(month)}
                            >
                                <Text as="--month-name">{format(month, 'MMMM')}</Text>
                            </Box>
                        ))}
                    </Flex>
                )}
            </Box>
        </Flex>
    );
};

export default LargeCalendar;
