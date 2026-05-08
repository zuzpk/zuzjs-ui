import { ReactNode } from "react";
import { CalendarDisabledDateInput, CalendarQuickOptionInput, CalendarRangeValue } from "../Calendar/types";
import { InputProps } from "../Input/types";

export type DatePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
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
}