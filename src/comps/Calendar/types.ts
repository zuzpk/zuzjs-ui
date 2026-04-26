import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";

export type CalendarRangeValue = {
    start: Date | null;
    end: Date | null;
};

export type CalendarProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    range?: boolean;
    rangeValue?: CalendarRangeValue;
    defaultRangeValue?: CalendarRangeValue;
    variant?: ValueOf<typeof Variant>;
    onChange?: (date: Date | null) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
};