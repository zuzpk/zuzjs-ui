import { ReactNode } from "react";
import { CalendarRangeValue } from "../Calendar/types";
import { InputProps } from "../Input/types";

export type DatePickerProps = InputProps & {
    icon?: ReactNode | string;
    defaultValue?: Date | null;
    dateValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    range?: boolean;
    defaultRangeValue?: CalendarRangeValue;
    rangeValue?: CalendarRangeValue;
    onDateChange?: (date: Date | null) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    displayFormat?: string;
}