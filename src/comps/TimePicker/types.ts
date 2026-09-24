import { ReactNode } from "react";
import { InputProps } from "../Input/types";

export type TimePickerValue = {
    hour: number;
    minute: number;
    second?: number;
    period?: "AM" | "PM";
}

export type TimePickerProps = Omit<InputProps, "defaultValue" | "value"> & {
    icon?: ReactNode | string;
    /** Default time value */
    defaultValue?: TimePickerValue | null;
    /** Controlled time value */
    timeValue?: TimePickerValue | null;
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
