import { ReactNode } from "react";
import { InputProps } from "../Input/types";

export type TimePickerValue = {
    hour: number;
    minute: number;
    second?: number;
    period?: "AM" | "PM";
}

/** Value type that accepts TimePickerValue, ISO Date string, or Date object */
export type TimePickerInputValue = TimePickerValue | string | Date;

export type TimePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
    /** Default time value - accepts TimePickerValue, ISO Date string, or Date object */
    defaultValue?: TimePickerInputValue | null;
    /** Controlled time value - accepts TimePickerValue, ISO Date string, or Date object */
    timeValue?: TimePickerInputValue | null;
    /** Use 12-hour format (AM/PM) instead of 24-hour */
    use12Hours?: boolean;
    /** Show seconds picker */
    showSeconds?: boolean;
    /** Minimum time (hour in 24h format) */
    minHour?: number;
    /** Maximum time (hour in 24h format) */
    maxHour?: number;
    /** Step interval for minutes */
    minuteStep?: number;
    /** Step interval for seconds */
    secondStep?: number;
    /** Display format - defaults to "HH:mm" or "HH:mm:ss" if showSeconds */
    displayFormat?: string;
    /** Custom value for input */
    value?: string;
    /** Callback when time changes */
    onTimeChange?: (time: TimePickerValue | null) => void;
    /** Callback when Enter is pressed */
    onConfirm?: (value: string) => void;
}
