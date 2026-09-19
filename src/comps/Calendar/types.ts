import { ReactNode } from "react";
import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";

export type CalendarRangeValue = {
    start: Date | null;
    end: Date | null;
};

export type CalendarChangeSource = "day" | "month" | "time";

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

export type CalendarViewMode = "week" | "month" | "year";

export type CalendarTimeSlot = {
    date: Date;
    timeStart: string; // "09:00"
    timeEnd: string;   // "10:00"
};

export type CalendarAppointment = {
    id: string | number;
    date: Date;
    timeStart: string; // "09:00"
    timeEnd: string;   // "10:30"
    title?: string;
    data?: any;
};

export type CalendarAppointmentRenderProps = {
    appointment: CalendarAppointment;
    style: React.CSSProperties;
    isDefault?: boolean;
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
    /** Time interval in minutes - default: 60 */
    timeInterval?: number;
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
};