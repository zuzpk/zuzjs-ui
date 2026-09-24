import { ReactNode } from "react";
import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";
import { dynamic } from "@zuzjs/core";

export type CalendarRangeValue = {
    start: Date | null;
    end: Date | null;
};

export type CalendarChangeSource = "day" | "month" | "time" | "week" | "year" | "today";

export type CalendarDisabledDateInput = string | Date;
export type CalendarQuickOptionLabel =
    | "Today"
    | "Later"
    | "Tomorrow"
    | "This weekend"
    | "Next week"
    | "Next weekend"
    | "2 weeks"
    | "4 weeks";
export type CalendarQuickOptionInput = CalendarQuickOptionLabel | CalendarDisabledDateInput;

export type CalendarViewMode = "day" | "week" | "month" | "year";

export type CalendarTimeSlot = {
    date: Date;
    timeStart: string; // "09:00"
    timeEnd: string;   // "10:00"
};

export type CalendarTimeRange = {
    start: CalendarTimeSlot;
    end: CalendarTimeSlot;
};

export type CalendarAppointment = {
    id: string | number;
    date: Date;
    timeStart: string; // "09:00"
    timeEnd: string;   // "10:30"
    title?: string;
    data?: dynamic;
};

export type CalendarAppointmentRenderProps = {
    appointment: CalendarAppointment;
    style: React.CSSProperties;
    isDefault?: boolean;
};

/** Day of week: 0 = Sunday, 1 = Monday, ..., 6 = Saturday */
export type CalendarWeekStartDay = 0 | 1 | 2 | 3 | 4 | 5 | 6;

/** Drag mode for appointment operations */
export type CalendarDragMode = "rightClickDrag" | "ctrlClickDrag";

/** Disabled time range within a day */
export type CalendarDisabledTimeRange = {
    /** Start time in HH:mm format */
    timeStart: string;
    /** End time in HH:mm format */
    timeEnd: string;
};

export type CalendarProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    range?: boolean;
    rangeValue?: CalendarRangeValue;
    defaultRangeValue?: CalendarRangeValue;
    variant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null, meta?: { source: CalendarChangeSource }) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    selectYear?: boolean;
    name?: string;
    /** Large calendar mode for scheduling views */
    large?: boolean;
    /** View mode for large calendar - default: week */
    viewMode?: CalendarViewMode;
    /** Start date for the view (defaults to today or value) */
    startDate?: Date;
    /** Day of the week to start (0=Sunday, 1=Monday, etc.) - default: 1 (Monday) */
    weekStartsOn?: CalendarWeekStartDay;
    /** Time interval in minutes - default: 60 (main slot size) */
    timeInterval?: number;
    /** Sub-interval in minutes for clickable slots within main intervals - e.g., 15 for 15-min slots within 1-hour intervals */
    subInterval?: number;
    /** Whether to show labels for sub-intervals - default: false (only main intervals are labeled) */
    showSubIntervalLabel?: boolean;
    /** Start hour (0-23) - default: 8 */
    startHour?: number;
    /** End hour (0-23) - default: 20 */
    endHour?: number;
    /** Appointments to render on the calendar */
    appointments?: CalendarAppointment[];
    /** Custom render for appointment blocks */
    renderAppointment?: (props: CalendarAppointmentRenderProps) => ReactNode;
    /** Callback when clicking on a time slot */
    onTimeSlotClick?: (slot: CalendarTimeSlot) => void;
    /** Callback when clicking on an appointment */
    onAppointmentClick?: (appointment: CalendarAppointment) => void;
    /** Callback when an appointment is moved or resized */
    onAppointmentChange?: (appointment: CalendarAppointment) => void;
    /** Enable multi-select by clicking and dragging across time slots */
    enableRangeSelect?: boolean;
    /** Callback when a time range is selected (when enableRangeSelect is true) */
    onTimeRangeSelect?: (range: CalendarTimeRange) => void;
    /** Disable dates after a specific threshold: 'today', 'next-week', or a specific Date */
    disableAfter?: 'today' | 'next-week' | Date;
};

export type LargeCalendarProps = Pick<CalendarProps,
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
    | 'onAppointmentChange'
    | 'enableRangeSelect'
    | 'onTimeRangeSelect'
    | 'disableAfter'
> & {
    visibleMonth: Date;
    themeVariant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null) => void;
    setVisibleMonth: (date: Date) => void;
    /** Called when the user switches Day/Week/Month/Year via the segmented control. Optional — LargeCalendar tracks the mode itself if this isn't provided. */
    onViewModeChange?: (viewMode: CalendarViewMode) => void;
    /** Drag mode for appointments - default: "rightClickDrag" */
    dragMode?: CalendarDragMode;
    /** Disabled time ranges (time of day that is disabled) */
    disabledTimeRanges?: CalendarDisabledTimeRange[];
    /** Prevent adding/moving appointments in past dates */
    disablePastDates?: boolean;
    /** Prevent adding/moving appointments in future dates */
    disableFutureDates?: boolean;
    /** Callback to determine if a specific date is disabled */
    isDateDisabled?: (date: Date) => boolean;
};