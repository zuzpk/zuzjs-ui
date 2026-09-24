"use client"
import { useDrag, useDrop, type DropProbe } from "@zuzjs/hooks";
import {
    addDays,
    addMonths,
    addWeeks,
    addYears,
    endOfMonth,
    endOfWeek,
    format,
    isAfter,
    isBefore,
    isSameDay,
    isSameMonth,
    isToday,
    startOfDay,
    startOfMonth,
    startOfWeek,
    subDays,
    subMonths,
    subWeeks,
    subYears,
} from "date-fns";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import Grid from "../Grid";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
import Text from "../Text";
import {
    CalendarAppointment,
    CalendarDisabledTimeRange,
    CalendarDragMode,
    CalendarTimeRange,
    CalendarTimeSlot,
    CalendarViewMode,
    CalendarWeekStartDay,
    LargeCalendarProps,
} from "./types";

type TimeSlot = {
    hour: number;
    minute: number;
    label: string;
};

type DragPoint = {
    day: Date;
    minutes: number;
};

type TimeScale = {
    viewStart: number;
    viewEnd: number;
    interval: number;
    slotStarts: number[];
};

type AppointmentMoveItem = {
    kind: "move";
    appointment: CalendarAppointment;
};

type AppointmentResizeItem = {
    kind: "resize";
    appointment: CalendarAppointment;
    edge: "start" | "end";
};

const APPOINTMENT_CHANNEL = "calendar-appointment";
const RESIZE_CHANNEL = "calendar-appointment-resize";

const viewModeSegments: { label: string; tag: CalendarViewMode }[] = [
    { label: `Day`, tag: `day` },
    { label: `Week`, tag: `week` },
    { label: `Month`, tag: `month` },
    { label: `Year`, tag: `year` },
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

/** Check if a time (in minutes) falls within a disabled time range */
const isTimeInRange = (minutes: number, range: CalendarDisabledTimeRange): boolean => {
    const start = parseHHmm(range.timeStart);
    const end = parseHHmm(range.timeEnd);
    return minutes >= start && minutes < end;
};

/** Check if a time slot overlaps with any disabled time range */
const isTimeSlotDisabled = (minutes: number, disabledRanges?: CalendarDisabledTimeRange[]): boolean => {
    if (!disabledRanges || disabledRanges.length === 0) return false;
    return disabledRanges.some(range => isTimeInRange(minutes, range));
};

/** Check if date is in the past */
const isPastDate = (date: Date): boolean => {
    return isBefore(startOfDay(date), startOfDay(new Date()));
};

/** Check if date is in the future */
const isFutureDate = (date: Date): boolean => {
    return isAfter(startOfDay(date), startOfDay(new Date()));
};

const getViewLabel = (date: Date, viewMode: CalendarViewMode, weekStartsOn: CalendarWeekStartDay): string => {
    switch (viewMode) {
        case 'day':
            return format(date, 'EEEE, MMM d, yyyy');
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
        case 'day':
            return [startOfDay(date)];
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
            const monthStart = startOfMonth(date);
            const monthEnd = endOfMonth(date);
            const start = startOfWeek(monthStart, { weekStartsOn });
            const end = endOfWeek(monthEnd, { weekStartsOn });
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

const parseHHmm = (value: string): number => {
    const [h, m] = value.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
};

const minutesToHHmm = (minutes: number): string => {
    const clamped = Math.max(0, Math.round(minutes));
    return formatTimeLabel(Math.floor(clamped / 60), clamped % 60);
};

const minutesToDate = (day: Date, minutes: number): Date => {
    const d = startOfDay(day);
    d.setMinutes(minutes);
    return d;
};

const buildSlotStarts = (startHour: number, endHour: number, interval: number): number[] => {
    const starts: number[] = [];
    for (let minutes = startHour * 60; minutes < endHour * 60; minutes += interval) {
        starts.push(minutes);
    }
    return starts;
};

const minutesToSlotIndex = (minutes: number, scale: TimeScale): number => {
    const { viewStart, viewEnd, interval, slotStarts } = scale;
    if (slotStarts.length === 0 || interval <= 0) return 0;
    if (minutes <= viewStart) return 0;
    if (minutes >= viewEnd) return slotStarts.length;
    return (minutes - viewStart) / interval;
};

/** Layout against the slot grid so 09:15–11:00 starts on 09:15 and ends on the 11:00 row. */
const getAppointmentLayout = (appointment: CalendarAppointment, scale: TimeScale) => {
    const start = Math.max(parseHHmm(appointment.timeStart), scale.viewStart);
    const end = Math.min(parseHHmm(appointment.timeEnd), scale.viewEnd);
    const count = scale.slotStarts.length;
    if (end <= start || count === 0) return null;

    const startIndex = minutesToSlotIndex(start, scale);
    let endIndex = minutesToSlotIndex(end, scale);
    // timeEnd names the last occupied slot (11:00 occupies the 11:00 row, not 10:45)
    if (endIndex < count && Number.isInteger(endIndex) && scale.slotStarts[endIndex] === end) {
        endIndex += 1;
    }
    endIndex = Math.min(count, Math.max(startIndex + 1, endIndex));

    return {
        top: (startIndex / count) * 100,
        bottom: ((count - endIndex) / count) * 100,
    };
};

const snapMinutes = (minutes: number, scale: TimeScale): number => {
    const snapped = scale.viewStart + Math.round((minutes - scale.viewStart) / scale.interval) * scale.interval;
    return Math.min(scale.viewEnd, Math.max(scale.viewStart, snapped));
};

const clampRange = (start: number, end: number, scale: TimeScale) => {
    let nextStart = start;
    let nextEnd = end;
    if (nextEnd - nextStart < scale.interval) {
        nextEnd = nextStart + scale.interval;
    }
    if (nextStart < scale.viewStart) {
        nextEnd += scale.viewStart - nextStart;
        nextStart = scale.viewStart;
    }
    if (nextEnd > scale.viewEnd) {
        nextStart -= nextEnd - scale.viewEnd;
        nextEnd = scale.viewEnd;
        if (nextStart < scale.viewStart) nextStart = scale.viewStart;
    }
    if (nextEnd - nextStart < scale.interval) {
        nextEnd = Math.min(scale.viewEnd, nextStart + scale.interval);
        nextStart = Math.max(scale.viewStart, nextEnd - scale.interval);
    }
    return {
        start: snapMinutes(nextStart, scale),
        end: snapMinutes(nextEnd, scale),
    };
};

const appointmentFromRange = (appointment: CalendarAppointment, day: Date, start: number, end: number): CalendarAppointment => ({
    ...appointment,
    date: startOfDay(day),
    timeStart: minutesToHHmm(start),
    timeEnd: minutesToHHmm(end),
});

const deltaMinutesFromOffset = (offsetY: number, bodyHeight: number, scale: TimeScale) => {
    if (bodyHeight <= 0) return 0;
    return (offsetY / bodyHeight) * (scale.viewEnd - scale.viewStart);
};

type DropFeedback = {
    id: string | number;
    day: Date;
    start: number;
    end: number;
    title?: string;
};

const DropFeedbackContext = createContext<{
    feedback: DropFeedback | null;
    setFeedback: React.Dispatch<React.SetStateAction<DropFeedback | null>>;
}>({
    feedback: null,
    setFeedback: () => {},
});

const snapMoveFromProbe = (
    item: AppointmentMoveItem,
    probe: DropProbe<AppointmentMoveItem | AppointmentResizeItem>,
    scale: TimeScale,
) => {
    // Safely check if bounds method exists and is callable
    if (typeof probe.bounds !== 'function') return null;
    const bounds = probe.bounds();
    const offset = probe.offset();
    if (!bounds || bounds.height <= 0) return null;
    const originalStart = parseHHmm(item.appointment.timeStart);
    const originalEnd = parseHHmm(item.appointment.timeEnd);
    const duration = Math.max(scale.interval, originalEnd - originalStart);
    const delta = deltaMinutesFromOffset(offset?.y ?? 0, bounds.height, scale);
    return clampRange(originalStart + delta, originalStart + delta + duration, scale);
};

const appointmentLayoutStyle = (layout: { top: number; bottom: number }): React.CSSProperties => ({
    position: "absolute",
    top: `${layout.top}%`,
    height: `${Math.max(0, 100 - layout.top - layout.bottom)}%`,
    left: 4,
    right: 4,
});

const AppointmentDropMeta: React.FC<{ day: Date; start: number; end: number }> = ({ day, start, end }) => (
    <Flex cols as="--appointment-drop-overlay abs fill flex cols aic jcc pe-none">
        <Text as="--drop-overlay-date bold">{format(day, "EEE, MMM d")}</Text>
        <Text as="--drop-overlay-time">{minutesToHHmm(start)} – {minutesToHHmm(end)}</Text>
    </Flex>
);

const TimeColumn: React.FC<{ mainTimeSlots: TimeSlot[]; subSlotOffsets: number[]; showSubIntervalLabel: boolean }> = ({
    mainTimeSlots,
    subSlotOffsets,
    showSubIntervalLabel,
}) => (
    <Flex cols as="--time-column-root">
        <Flex gap={4} as={`--day-header --calendar-column flex aic jcc`} />
        {mainTimeSlots.map((slot, idx) => (
            <React.Fragment key={`time-col-${idx}`}>
                <Flex aic jce as="--time-label --calendar-column --time-column w-full">
                    <Text as="--time-text">{slot.label}</Text>
                </Flex>
                {subSlotOffsets.map((offset) => {
                    const totalMinutes = slot.hour * 60 + slot.minute + offset;
                    return (
                        <Flex
                            key={`time-col-${idx}-${offset}`}
                            aic
                            jce
                            as="--time-label --calendar-column --time-column --sub-slot w-full">
                            {showSubIntervalLabel && (
                                <Text as="--time-text --sub">
                                    {formatTimeLabel(Math.floor(totalMinutes / 60), totalMinutes % 60)}
                                </Text>
                            )}
                        </Flex>
                    );
                })}
            </React.Fragment>
        ))}
    </Flex>
);

const AppointmentContent: React.FC<{ appointment: CalendarAppointment }> = ({ appointment }) => (
    <Flex cols as="--appointment-body w-full flex-1 minW:0">
        <Text as="--appointment-title">{appointment.title}</Text>
        <Text as="--appointment-time">
            {appointment.timeStart} – {appointment.timeEnd}
        </Text>
    </Flex>
);

const AppointmentBlock: React.FC<{
    appointment: CalendarAppointment;
    scale: TimeScale;
    disabled?: boolean;
    dragMode?: CalendarDragMode;
    onChange?: (appointment: CalendarAppointment) => void;
    onClick?: (appointment: CalendarAppointment) => void;
}> = ({ appointment, scale, disabled, dragMode = "rightClickDrag", onChange, onClick }) => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const movedRef = useRef(false);
    const dragStartedRef = useRef(false);
    const [canDrag, setCanDrag] = useState(false);
    const { setFeedback } = useContext(DropFeedbackContext);

    const readBodyHeight = useCallback(() => (
        wrapperRef.current?.parentElement?.getBoundingClientRect().height ?? 0
    ), []);

    // Suppress the browser's native context menu via a raw, non-React listener
    // attached directly to the DOM node. This is intentionally decoupled from
    // React's synthetic onContextMenu (and from the flushSync-driven re-render
    // in handleMouseDown below): a native listener registered once via
    // useEffect can't be affected by React re-render/commit timing the way a
    // delegated synthetic handler might be, so it's the most reliable place to
    // guarantee the menu never appears while dragging is enabled.
    useEffect(() => {
        const node = wrapperRef.current;
        if (!node || disabled) return;
        const suppress = (event: MouseEvent) => {
            event.preventDefault();
        };
        node.addEventListener("contextmenu", suppress);
        return () => node.removeEventListener("contextmenu", suppress);
    }, [disabled]);

    const applyResize = useCallback((edge: "start" | "end", offsetY: number): CalendarAppointment => {
        const originalStart = parseHHmm(appointment.timeStart);
        const originalEnd = parseHHmm(appointment.timeEnd);
        const delta = deltaMinutesFromOffset(offsetY, readBodyHeight(), scale);
        const next = edge === "start"
            ? clampRange(originalStart + delta, originalEnd, scale)
            : clampRange(originalStart, originalEnd + delta, scale);
        return appointmentFromRange(appointment, appointment.date, next.start, next.end);
    }, [appointment, readBodyHeight, scale]);

    const [{ isDragging }, moveRef] = useDrag<AppointmentMoveItem, { isDragging: boolean }>(() => ({
        channel: APPOINTMENT_CHANNEL,
        when: canDrag && !disabled,
        payload: { kind: "move", appointment },
        observe: (probe) => ({ isDragging: probe.active() }),
        onStart: () => {
            dragStartedRef.current = true;
        },
        onFinish: (_item, probe) => {
            const offset = probe.offset();
            const hasMoved = Math.abs(offset?.x ?? 0) > 3 || Math.abs(offset?.y ?? 0) > 3;
            movedRef.current = hasMoved;
            dragStartedRef.current = false;
            setCanDrag(false);
            setFeedback(null);
        },
    }), [appointment, disabled, setFeedback, canDrag]);

    const [{ isResizing: resizingStart, offsetY: startOffsetY }, startResizeRef] = useDrag<AppointmentResizeItem, { isResizing: boolean; offsetY: number }>(() => ({
        channel: RESIZE_CHANNEL,
        when: canDrag && !disabled,
        payload: { kind: "resize", appointment, edge: "start" },
        observe: (probe) => ({
            isResizing: probe.active(),
            offsetY: probe.offset()?.y ?? 0,
        }),
        onStart: () => {
            dragStartedRef.current = true;
        },
        onFinish: (_item, probe) => {
            movedRef.current = true;
            dragStartedRef.current = false;
            setCanDrag(false);
            onChange?.(applyResize("start", probe.offset()?.y ?? 0));
        },
    }), [appointment, disabled, applyResize, onChange, canDrag]);

    const [{ isResizing: resizingEnd, offsetY: endOffsetY }, endResizeRef] = useDrag<AppointmentResizeItem, { isResizing: boolean; offsetY: number }>(() => ({
        channel: RESIZE_CHANNEL,
        when: canDrag && !disabled,
        payload: { kind: "resize", appointment, edge: "end" },
        observe: (probe) => ({
            isResizing: probe.active(),
            offsetY: probe.offset()?.y ?? 0,
        }),
        onStart: () => {
            dragStartedRef.current = true;
        },
        onFinish: (_item, probe) => {
            movedRef.current = true;
            dragStartedRef.current = false;
            setCanDrag(false);
            onChange?.(applyResize("end", probe.offset()?.y ?? 0));
        },
    }), [appointment, disabled, applyResize, onChange, canDrag]);

    // Handle mouse down to enable drag based on mode.
    // IMPORTANT: bound via onMouseDownCapture (not onMouseDown) further down.
    // useDrag's own native mousedown listener is attached directly to the
    // ref'd DOM node, so it fires in the DOM's target phase — which happens
    // *before* React's regular bubble-phase onMouseDown (React delegates
    // bubble events to the root, so they run later). That meant this same
    // mousedown was already rejected by useDrag (`when` still false) by the
    // time we set canDrag — the flag only became true in time for the *next*
    // unrelated click. Capture-phase listeners on an ancestor (which is what
    // React attaches for onMouseDownCapture) always run before target-phase
    // listeners on the target itself, so this now runs first. flushSync
    // forces the state update (and useDrag's layout effect that re-binds its
    // listener) to commit synchronously before the event continues to the
    // target, so useDrag sees the correct `when` for this exact press.
    const handleMouseDown = useCallback((event: React.MouseEvent) => {
        if (disabled) return;

        if (dragMode === "ctrlClickDrag") {
            // Ctrl/Cmd + left click only
            if ((event.ctrlKey || event.metaKey) && event.button === 0) {
                event.preventDefault();
                flushSync(() => setCanDrag(true));
            }
        } else if (dragMode === "rightClickDrag") {
            // Right mouse button press
            if (event.button === 2) {
                event.preventDefault();
                flushSync(() => setCanDrag(true));
            }
        }
    }, [disabled, dragMode]);

    // Safety net: if a press armed canDrag but never turned into an actual
    // drag (e.g. a plain right-click with no movement — which triggers
    // neither onClick nor useDrag's onFinish), clear the flag on mouseup so
    // it can't leak into the next, unrelated interaction.
    const handleMouseUp = useCallback(() => {
        if (!dragStartedRef.current) {
            setCanDrag(false);
        }
    }, []);

    const preview = resizingStart
        ? applyResize("start", startOffsetY)
        : resizingEnd
            ? applyResize("end", endOffsetY)
            : appointment;

    const layout = getAppointmentLayout(preview, scale);
    if (!layout) return null;

    const isResizing = resizingStart || resizingEnd;

    return (
        <Flex
            ref={wrapperRef}
            cols
            as={`--appointment ${isDragging ? '--ghost' : ''} ${isResizing ? '--resizing' : ''}`}
            style={appointmentLayoutStyle(layout)}
            onClick={(event: React.MouseEvent) => {
                event.stopPropagation();
                // Reset state
                setCanDrag(false);
                movedRef.current = false;
                dragStartedRef.current = false;
                
                // Trigger click callback only if it was a simple click
                onClick?.(appointment);
            }}
            onMouseDownCapture={handleMouseDown}
            onMouseUp={handleMouseUp}
            onContextMenu={(event: React.MouseEvent) => {
                // Only suppress the native menu here — arming happens on mousedown
                // (see handleMouseDown) since contextmenu fires too late (typically
                // on mouse-up) to gate the start of a drag gesture.
                if (!disabled) {
                    event.preventDefault();
                }
                
            }}
            >
            <Box
                ref={startResizeRef}
                as="--appointment-resize --start"
                onMouseDownCapture={handleMouseDown}
            />
            <Flex
                ref={moveRef}
                cols
                as="--appointment-body w-full flex-1 minW:0"
                onMouseDownCapture={handleMouseDown}>
                <Text as="--appointment-title">{preview.title}</Text>
                <Text as="--appointment-time">
                    {preview.timeStart} – {preview.timeEnd}
                </Text>
            </Flex>
            <Box
                ref={endResizeRef}
                as="--appointment-resize --end"
                onMouseDownCapture={handleMouseDown}
            />
        </Flex>
    );
};

type DayColumnProps = {
    day: Date;
    disabled: boolean;
    selected: boolean;
    mainTimeSlots: TimeSlot[];
    subSlotOffsets: number[];
    appointments: CalendarAppointment[];
    scale: TimeScale;
    disabledTimeRanges?: CalendarDisabledTimeRange[];
    dragMode?: CalendarDragMode;
    onDayClick: (day: Date) => void;
    onSlotMouseDown: (day: Date, minutes: number) => void;
    onSlotMouseUp: (day: Date, minutes: number) => void;
    onAppointmentClick?: (appointment: CalendarAppointment) => void;
    onAppointmentChange?: (appointment: CalendarAppointment) => void;
    renderAppointment?: LargeCalendarProps['renderAppointment'];
};

const DayColumn: React.FC<DayColumnProps> = ({
    day,
    disabled,
    selected,
    mainTimeSlots,
    subSlotOffsets,
    appointments,
    scale,
    disabledTimeRanges,
    dragMode,
    onDayClick,
    onSlotMouseDown,
    onSlotMouseUp,
    onAppointmentClick,
    onAppointmentChange,
    renderAppointment,
}) => {
    const { setFeedback } = useContext(DropFeedbackContext);
    const [dropPreview, setDropPreview] = useState<DropFeedback | null>(null);

    const [{ isOver }, dropRef] = useDrop<AppointmentMoveItem | AppointmentResizeItem, { isOver: boolean }>(() => ({
        accepts: [APPOINTMENT_CHANNEL, RESIZE_CHANNEL],
        canReceive: () => !disabled,
        observe: (probe) => ({ isOver: probe.hovering() && probe.canReceive() }),
        onHover: (item, probe) => {
            if (!item || item.kind !== "move") return;
            const next = snapMoveFromProbe(item, probe, scale);
            if (!next) return;
            const preview: DropFeedback = {
                id: item.appointment.id,
                day,
                start: next.start,
                end: next.end,
                title: item.appointment.title,
            };
            setDropPreview((current) => (
                current
                && current.id === preview.id
                && current.start === preview.start
                && current.end === preview.end
                && isSameDay(current.day, preview.day)
                    ? current
                    : preview
            ));
            setFeedback(preview);
        },
        onReceive: (item, probe) => {
            if (!item || item.kind !== "move") return;
            const next = snapMoveFromProbe(item, probe, scale);
            setDropPreview(null);
            setFeedback(null);
            if (!next) return;
            onAppointmentChange?.(appointmentFromRange(item.appointment, day, next.start, next.end));
        },
    }), [day, disabled, onAppointmentChange, scale, setFeedback]);

    useEffect(() => {
        if (isOver) return;
        setDropPreview(null);
        setFeedback((current) => current && isSameDay(current.day, day) ? null : current);
    }, [isOver, day, setFeedback]);

    const dropPreviewLayout = dropPreview
        ? getAppointmentLayout({
            id: dropPreview.id,
            date: day,
            timeStart: minutesToHHmm(dropPreview.start),
            timeEnd: minutesToHHmm(dropPreview.end),
            title: dropPreview.title,
        }, scale)
        : null;

    return (
        <Flex cols as={`--day-column w-full minW:0 ${isToday(day) ? `--day-today` : ``} ${isOver ? '--drop-over' : ''} ${disabled ? '--has-stripes' : ''}`}>
            <Flex
                gap={4}
                onClick={() => !disabled && onDayClick(day)}
                as={`--day-header --calendar-column flex aic jcc w-full ${isToday(day) ? '--today' : ''} ${disabled ? '--disabled --has-stripes' : ''}`}>
                <Text as="--day-name">{format(day, 'EEE')}</Text>
                <Text as={`--day-number ${selected ? '--selected' : ''}`}>{format(day, 'd')}</Text>
            </Flex>

            <Flex
                ref={dropRef}
                cols
                as={`--calendar-day-body rel w-full minW:0 ${isOver ? '--drop-over' : ''}`}>
                {mainTimeSlots.map((slot, idx) => {
                    const mainMinutes = slot.hour * 60 + slot.minute;
                    const isSlotDisabled = disabled || isTimeSlotDisabled(mainMinutes, disabledTimeRanges);
                    return (
                        <React.Fragment key={`day-col-${idx}`}>
                            <Flex
                                as={`--calendar-column --time-column w-full ${isSlotDisabled ? '--disabled --has-stripes' : ''}`}
                                onMouseDown={() => !isSlotDisabled && onSlotMouseDown(day, mainMinutes)}
                                onMouseUp={() => !isSlotDisabled && onSlotMouseUp(day, mainMinutes)}
                            />
                            {subSlotOffsets.map((offset) => {
                                const minutes = mainMinutes + offset;
                                const isSubSlotDisabled = disabled || isTimeSlotDisabled(minutes, disabledTimeRanges);
                                return (
                                    <Flex
                                        key={`day-col-${idx}-${offset}`}
                                        as={`--calendar-column --time-column --sub-slot w-full ${isSubSlotDisabled ? '--disabled --has-stripes' : ''}`}
                                        onMouseDown={() => !isSubSlotDisabled && onSlotMouseDown(day, minutes)}
                                        onMouseUp={() => !isSubSlotDisabled && onSlotMouseUp(day, minutes)}
                                    />
                                );
                            })}
                        </React.Fragment>
                    );
                })}

                {appointments.map((appointment) => {
                    const layout = getAppointmentLayout(appointment, scale);
                    if (!layout) return null;

                    const style: React.CSSProperties = {
                        position: 'absolute',
                        top: `${layout.top}%`,
                        bottom: `${layout.bottom}%`,
                        height: 'auto',
                        left: 4,
                        right: 4,
                    };

                    if (renderAppointment) {
                        return (
                            <React.Fragment key={appointment.id}>
                                {renderAppointment({ appointment, style, isDefault: false })}
                            </React.Fragment>
                        );
                    }

                    return (
                        <AppointmentBlock
                            key={appointment.id}
                            appointment={appointment}
                            scale={scale}
                            disabled={disabled}
                            dragMode={dragMode}
                            onChange={onAppointmentChange}
                            onClick={onAppointmentClick}
                        />
                    );
                })}

                {dropPreview && dropPreviewLayout && (
                    <Flex
                        cols
                        as="--appointment --drop-preview pe-none"
                        style={appointmentLayoutStyle(dropPreviewLayout)}>
                        <AppointmentContent
                            appointment={{
                                id: dropPreview.id,
                                date: day,
                                timeStart: minutesToHHmm(dropPreview.start),
                                timeEnd: minutesToHHmm(dropPreview.end),
                                title: dropPreview.title,
                            }}
                        />
                        <AppointmentDropMeta day={day} start={dropPreview.start} end={dropPreview.end} />
                    </Flex>
                )}
            </Flex>
        </Flex>
    );
};

const LargeCalendar = (props: LargeCalendarProps) => {
    const {
        viewMode: viewModeProp,
        weekStartsOn = 1,
        variant,
        themeVariant,
        startDate,
        setVisibleMonth,
        disableAfter,
        startHour = 8,
        endHour = 20,
        timeInterval = 60,
        subInterval,
        showSubIntervalLabel = false,
        appointments = [],
        renderAppointment,
        onTimeSlotClick,
        onAppointmentClick,
        onAppointmentChange,
        enableRangeSelect,
        onTimeRangeSelect,
        onViewModeChange,
        onChange,
        value,
        dragMode = "ctrlClickDrag",
        disabledTimeRanges,
        disablePastDates = false,
        disableFutureDates = false,
        isDateDisabled,
    } = props;

    const isViewModeControlled = props.viewMode !== undefined && typeof onViewModeChange === `function`;
    const [localViewMode, setLocalViewMode] = useState<CalendarViewMode>(viewModeProp ?? `week`);
    const viewMode = isViewModeControlled ? (viewModeProp ?? `week`) : localViewMode;
    const viewModeIndex = Math.max(0, viewModeSegments.findIndex((segment) => segment.tag === viewMode));

    const setViewMode = useCallback((mode: CalendarViewMode) => {
        if (!isViewModeControlled) setLocalViewMode(mode);
        onViewModeChange?.(mode);
    }, [isViewModeControlled, onViewModeChange]);

    // Own cursor: today (or startDate filter). Do not use useCalendar's start-of-month visibleMonth.
    const [visibleDate, setVisibleDateState] = useState(() => startOfDay(startDate || new Date()));

    useEffect(() => {
        if (startDate) setVisibleDateState(startOfDay(startDate));
    }, [startDate]);

    const setVisibleDate = useCallback((date: Date) => {
        const next = startOfDay(date);
        setVisibleDateState(next);
        setVisibleMonth(next);
    }, [setVisibleMonth]);

    const referenceDate = visibleDate;

    const daysInView = useMemo(() => getDaysInView(referenceDate, viewMode, weekStartsOn), [referenceDate, viewMode, weekStartsOn]);

    const maxAllowedDate = useMemo(() => getMaxAllowedDate(disableAfter), [disableAfter]);

    const hasSubIntervals = !!subInterval && subInterval < timeInterval;
    const effectiveSubInterval = hasSubIntervals ? subInterval! : timeInterval;

    const timeScale = useMemo<TimeScale>(() => ({
        viewStart: startHour * 60,
        viewEnd: endHour * 60,
        interval: effectiveSubInterval,
        slotStarts: buildSlotStarts(startHour, endHour, effectiveSubInterval),
    }), [startHour, endHour, effectiveSubInterval]);

    const isDayDisabled = useCallback((day: Date): boolean => {
        // Check custom disabled function first
        if (isDateDisabled?.(day)) return true;
        // Check past dates
        if (disablePastDates && isPastDate(day)) return true;
        // Check future dates
        if (disableFutureDates && isFutureDate(day)) return true;
        // Check disableAfter
        if (maxAllowedDate && isAfter(startOfDay(day), maxAllowedDate)) return true;
        return false;
    }, [maxAllowedDate, disablePastDates, disableFutureDates, isDateDisabled]);

    const mainTimeSlots: TimeSlot[] = useMemo(() => {
        const slots: TimeSlot[] = [];
        for (let h = startHour; h < endHour; h++) {
            for (let m = 0; m < 60; m += timeInterval) {
                slots.push({ hour: h, minute: m, label: formatTimeLabel(h, m) });
            }
        }
        return slots;
    }, [startHour, endHour, timeInterval]);

    const subSlotOffsets = useMemo(() => {
        if (!hasSubIntervals) return [];
        const count = Math.round(timeInterval / effectiveSubInterval) - 1;
        return Array.from({ length: Math.max(count, 0) }, (_, i) => (i + 1) * effectiveSubInterval);
    }, [hasSubIntervals, timeInterval, effectiveSubInterval]);

    const appointmentsKey = appointments
        .map((item) => `${item.id}:${item.date.getTime()}:${item.timeStart}:${item.timeEnd}:${item.title ?? ""}`)
        .join("|");
    const [localAppointments, setLocalAppointments] = useState(appointments);

    useEffect(() => {
        setLocalAppointments(appointments);
    }, [appointmentsKey]);

    const handleAppointmentChange = useCallback((next: CalendarAppointment) => {
        setLocalAppointments((current) => current.map((item) => item.id === next.id ? next : item));
        onAppointmentChange?.(next);
    }, [onAppointmentChange]);

    const goto = useCallback((direction: 1 | -1) => {
        const stepFns: Record<CalendarViewMode, (d: Date, amount: number) => Date> = {
            day: (d, amount) => (amount > 0 ? addDays(d, 1) : subDays(d, 1)),
            week: (d, amount) => (amount > 0 ? addWeeks(d, 1) : subWeeks(d, 1)),
            month: (d, amount) => (amount > 0 ? addMonths(d, 1) : subMonths(d, 1)),
            year: (d, amount) => (amount > 0 ? addYears(d, 1) : subYears(d, 1)),
        };
        setVisibleDate(stepFns[viewMode](referenceDate, direction));
    }, [viewMode, referenceDate, setVisibleDate]);

    const gotoPrev = useCallback(() => goto(-1), [goto]);
    const gotoNext = useCallback(() => goto(1), [goto]);
    const gotoToday = useCallback(() => setVisibleDate(new Date()), [setVisibleDate]);

    const handleDayClick = useCallback((day: Date) => {
        onChange?.(day);
    }, [onChange]);

    const dragStartRef = useRef<DragPoint | null>(null);

    const handleSlotMouseDown = useCallback((day: Date, minutes: number) => {
        dragStartRef.current = { day, minutes };
    }, []);

    const buildTimeSlot = useCallback((day: Date, minutes: number): CalendarTimeSlot => {
        const slotEndMinutes = minutes + effectiveSubInterval;
        return {
            date: minutesToDate(day, minutes),
            timeStart: formatTimeLabel(Math.floor(minutes / 60), minutes % 60),
            timeEnd: formatTimeLabel(Math.floor(slotEndMinutes / 60), slotEndMinutes % 60),
        };
    }, [effectiveSubInterval]);

    const handleSlotMouseUp = useCallback((day: Date, minutes: number) => {
        const start = dragStartRef.current;
        dragStartRef.current = null;
        if (!start) return;

        const isDrag = enableRangeSelect && (!isSameDay(start.day, day) || start.minutes !== minutes);

        if (isDrag && onTimeRangeSelect) {
            const [from, to] = start.minutes <= minutes || !isSameDay(start.day, day)
                ? [start, { day, minutes }]
                : [{ day, minutes }, start];

            const range: CalendarTimeRange = {
                start: buildTimeSlot(from.day, from.minutes),
                end: buildTimeSlot(to.day, to.minutes),
            };
            onTimeRangeSelect(range);
            return;
        }

        onTimeSlotClick?.(buildTimeSlot(day, minutes));
    }, [enableRangeSelect, onTimeRangeSelect, onTimeSlotClick, buildTimeSlot]);

    const getAppointmentsForDay = useCallback((day: Date) => {
        return localAppointments.filter((a) => isSameDay(a.date, day));
    }, [localAppointments]);

    const isTimeGridView = viewMode === 'day' || viewMode === 'week';
    const [dropFeedback, setDropFeedback] = useState<DropFeedback | null>(null);

    return (
        <DropFeedbackContext.Provider value={{ feedback: dropFeedback, setFeedback: setDropFeedback }}>
        <Flex as={`--large-calendar --${themeVariant} flex cols`}>

            <Flex as="--large-calendar-header flex aic jcb">

                <Flex aic gap={8} as={`flex:1`}>
                    <Text as="--calendar-range bold">{getViewLabel(referenceDate, viewMode, weekStartsOn)}</Text>
                </Flex>

                <Flex aic jcc gap={8} as={`flex:1`}>
                    <Segmented
                        variant={variant || themeVariant || Variant.Small}
                        items={viewModeSegments}
                        selected={viewModeIndex}
                        onSwitch={(seg) => setViewMode(seg.tag as CalendarViewMode)}
                    />
                </Flex>

                <Flex aic jce gap={4} as={`flex:1`}>
                    <Button variant={variant || themeVariant} onClick={gotoPrev} as="--nav-btn">
                        {SVGIcons.chevronLeftOutline}
                    </Button>
                    <Button variant={variant || themeVariant} onClick={gotoToday} as="--today-btn">Today</Button>
                    <Button variant={variant || themeVariant} onClick={gotoNext} as="--nav-btn">
                        {SVGIcons.chevronRightOutline}
                    </Button>
                </Flex>

            </Flex>

            {isTimeGridView ? (
                <Grid
                    columns={`auto repeat(${daysInView.length}, minmax(0, 1fr))`}
                    alignItems="stretch"
                    as="--large-calendar-grid w-full">
                    <TimeColumn
                        mainTimeSlots={mainTimeSlots}
                        subSlotOffsets={subSlotOffsets}
                        showSubIntervalLabel={showSubIntervalLabel}
                    />

                    {daysInView.map((day) => (
                        <DayColumn
                            key={day.toISOString()}
                            day={day}
                            disabled={isDayDisabled(day)}
                            selected={!!value && isSameDay(day, value)}
                            mainTimeSlots={mainTimeSlots}
                            subSlotOffsets={subSlotOffsets}
                            appointments={getAppointmentsForDay(day)}
                            scale={timeScale}
                            disabledTimeRanges={disabledTimeRanges}
                            dragMode={dragMode}
                            onDayClick={handleDayClick}
                            onSlotMouseDown={handleSlotMouseDown}
                            onSlotMouseUp={handleSlotMouseUp}
                            onAppointmentClick={onAppointmentClick}
                            onAppointmentChange={handleAppointmentChange}
                            renderAppointment={renderAppointment}
                        />
                    ))}
                </Grid>
            ) : viewMode === 'month' ? (
                <Grid columns={`repeat(7, minmax(0, 1fr))`} as="--large-calendar-month-grid w-full">
                    {daysInView.map((day) => {
                        const disabled = isDayDisabled(day) || !isSameMonth(day, referenceDate);
                        const dayAppointments = getAppointmentsForDay(day);
                        return (
                            <Flex
                                key={day.toISOString()}
                                cols
                                onClick={() => !disabled && handleDayClick(day)}
                                as={`--calendar-column --month-cell w-full minW:0 ${isToday(day) ? '--today' : ''} ${disabled ? '--disabled --has-stripes' : ''} ${value && isSameDay(day, value) ? '--selected' : ''}`}>
                                <Text as="--day-number">{format(day, 'd')}</Text>
                                {dayAppointments.length > 0 && (
                                    <Text as="--month-cell-count">{dayAppointments.length} appt{dayAppointments.length > 1 ? 's' : ''}</Text>
                                )}
                            </Flex>
                        );
                    })}
                </Grid>
            ) : (
                <Grid columns={`repeat(4, minmax(0, 1fr))`} as="--large-calendar-year-grid w-full">
                    {daysInView.map((month) => {
                        const monthAppointments = localAppointments.filter((a) => isSameMonth(a.date, month));
                        return (
                            <Flex
                                key={month.toISOString()}
                                cols
                                onClick={() => {
                                    setVisibleDate(month);
                                    setViewMode('month');
                                }}
                                as={`--calendar-column --year-cell w-full minW:0 ${isSameMonth(month, new Date()) ? '--today' : ''}`}>
                                <Text as="--month-name">{format(month, 'MMMM')}</Text>
                                {monthAppointments.length > 0 && (
                                    <Text as="--month-cell-count">{monthAppointments.length} appt{monthAppointments.length > 1 ? 's' : ''}</Text>
                                )}
                            </Flex>
                        );
                    })}
                </Grid>
            )}

        </Flex>
        </DropFeedbackContext.Provider>
    );
};

export default LargeCalendar;