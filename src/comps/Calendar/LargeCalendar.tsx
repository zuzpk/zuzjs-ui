"use client";
import { addDays, addMinutes, addWeeks, endOfWeek, format, isSameDay, isToday, setHours, setMinutes, startOfWeek } from "date-fns";
import { ReactNode, useMemo } from "react";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import Select from "../Select";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { CalendarAppointment, CalendarAppointmentRenderProps, CalendarProps, CalendarTimeSlot, CalendarViewMode } from "./types";

type LargeCalendarProps = Pick<CalendarProps,
    | 'value'
    | 'defaultValue'
    | 'variant'
    | 'viewMode'
    | 'timeInterval'
    | 'startHour'
    | 'endHour'
    | 'appointments'
    | 'renderAppointment'
    | 'onTimeSlotClick'
    | 'onAppointmentClick'
> & {
    visibleMonth: Date;
    themeVariant: string;
    onChange?: (date: Date | null) => void;
    setVisibleMonth: (date: Date) => void;
};

const DEFAULT_TIME_SLOT_HEIGHT = 48; // px per hour slot
const HEADER_HEIGHT = 50;
const TIME_COLUMN_WIDTH = 80;

const getViewLabel = (date: Date, viewMode: CalendarViewMode): string => {
    switch (viewMode) {
        case 'week': {
            const start = startOfWeek(date);
            const end = endOfWeek(date);
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

const getDaysInView = (date: Date, viewMode: CalendarViewMode): Date[] => {
    switch (viewMode) {
        case 'week': {
            const start = startOfWeek(date);
            const end = endOfWeek(date);
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

const LargeCalendar = (props: LargeCalendarProps) => {
    const {
        value,
        visibleMonth,
        themeVariant,
        viewMode = 'week',
        timeInterval = 60,
        startHour = 8,
        endHour = 20,
        appointments = [],
        renderAppointment,
        onTimeSlotClick,
        onAppointmentClick,
        setVisibleMonth
    } = props;

    // Generate time slots
    const timeSlots = useMemo(() => {
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

    // Get days to display
    const daysInView = useMemo(() => getDaysInView(visibleMonth, viewMode), [visibleMonth, viewMode]);

    // Calculate slot height based on interval
    const slotHeight = useMemo(() => {
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

    // Navigate to previous period
    const gotoPrev = () => {
        switch (viewMode) {
            case 'week':
                setVisibleMonth(addWeeks(visibleMonth, -1));
                break;
            case 'month':
                setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1));
                break;
            case 'year':
                setVisibleMonth(new Date(visibleMonth.getFullYear() - 1, 0, 1));
                break;
        }
    };

    // Navigate to next period
    const gotoNext = () => {
        switch (viewMode) {
            case 'week':
                setVisibleMonth(addWeeks(visibleMonth, 1));
                break;
            case 'month':
                setVisibleMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1));
                break;
            case 'year':
                setVisibleMonth(new Date(visibleMonth.getFullYear() + 1, 0, 1));
                break;
        }
    };

    // Go to today
    const gotoToday = () => {
        setVisibleMonth(new Date());
    };

    // Handle cell click
    const handleCellClick = (day: Date, slot: typeof timeSlots[0]) => {
        if (onTimeSlotClick) {
            const dateWithTime = setMinutes(setHours(day, slot.hour), slot.minute);
            const endTime = format(addMinutes(dateWithTime, timeInterval), 'HH:mm');
            onTimeSlotClick({
                date: dateWithTime,
                timeStart: slot.label,
                timeEnd: endTime
            });
        }
    };

    // Default appointment render
    const defaultRenderAppointment = (props: CalendarAppointmentRenderProps): ReactNode => {
        const { appointment, style } = props;
        return (
            <Box
                as={`--large-calendar-appointment`}
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
    const getAppointmentStyle = (appointment: typeof appointments[0]): React.CSSProperties | null => {
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
        <Flex as={`--large-calendar --${themeVariant} flex cols`} style={{ width: '100%', height: '100%' }}>
            {/* Header */}
            <Flex as="--large-calendar-header flex aic jcb" style={{ minHeight: HEADER_HEIGHT }}>
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
                    <Text as="--calendar-range bold">{getViewLabel(visibleMonth, viewMode)}</Text>
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
            <Box as="--large-calendar-grid" style={{ flex: 1, overflow: 'auto', position: 'relative' }}>
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
                                as={`--day-header flex cols aic jcc ${isToday(day) ? '--today' : ''}`}
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
                            {timeSlots.map((slot, idx) => (
                                <Box
                                    key={`time-slot-${idx}`}
                                    as="--time-label"
                                    style={{ height: slotHeight }}
                                >
                                    <Text as="--time-text">{slot.label}</Text>
                                </Box>
                            ))}
                        </Box>

                        {/* Day Columns with time cells */}
                        {daysInView.map((day, dayIdx) => {
                            const dateKey = format(day, 'yyyy-MM-dd');
                            const dayAppointments = appointmentsByDate.get(dateKey) || [];

                            return (
                                <Box
                                    key={`day-col-${dayIdx}`}
                                    as={`--day-column rel ${isToday(day) ? '--today' : ''}`}
                                >
                                    {/* Time cells */}
                                    {timeSlots.map((slot, slotIdx) => (
                                        <Box
                                            key={`cell-${dayIdx}-${slotIdx}`}
                                            as="--time-cell"
                                            style={{ height: slotHeight }}
                                            onClick={() => handleCellClick(day, slot)}
                                        />
                                    ))}

                                    {/* Appointments */}
                                    {dayAppointments.map(apt => {
                                        const style = getAppointmentStyle(apt);
                                        if (!style) return null;

                                        const renderProps: CalendarAppointmentRenderProps = {
                                            appointment: apt,
                                            style,
                                            isDefault: !renderAppointment
                                        };

                                        return renderAppointment
                                            ? renderAppointment(renderProps)
                                            : defaultRenderAppointment(renderProps);
                                    })}
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
