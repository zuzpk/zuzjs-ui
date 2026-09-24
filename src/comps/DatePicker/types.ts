import { ReactNode } from "react";
import { CalendarDisabledDateInput, CalendarQuickOptionInput, CalendarRangeValue } from "../Calendar/types";
import { InputProps } from "../Input/types";

export type DatePickerMode = "date" | "time";

export type DatePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
    /** Mode: "date" (default) or "time" */
    mode?: DatePickerMode;
    defaultValue?: Date | null;
    dateValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    range?: boolean;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    defaultRangeValue?: CalendarRangeValue;
    rangeValue?: CalendarRangeValue;
    onDateChange?: (date: Date | null) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    displayFormat?: string;
    value?: string;
    selectYear?: boolean;
    /** Use 12-hour format (AM/PM) for time mode */
    use12Hours?: boolean;
    /** Show seconds in time mode */
    showSeconds?: boolean;
    /** Minute step interval for time mode */
    minuteStep?: number;
}