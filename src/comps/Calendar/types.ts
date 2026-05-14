import { ValueOf } from "../../types";
import { Variant } from "../../types/enums";

export type CalendarRangeValue = {
    start: Date | null;
    end: Date | null;
};

export type CalendarChangeSource = "day" | "month";

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
};