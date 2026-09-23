"use client";
import { addDays, addHours, addMonths, addWeeks, addYears, eachDayOfInterval, endOfMonth, endOfWeek, endOfYear, format, isAfter, isBefore, isSameDay, isSameMonth, isToday, isValid, isWithinInterval, parse, startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

import type {
    CalendarChangeSource,
    CalendarDisabledDateInput,
    CalendarQuickOptionInput,
    CalendarQuickOptionLabel,
    CalendarRangeValue,
    CalendarWeekStartDay,
} from "../comps/Calendar/types";

export type CalendarNavUnit = "day" | "week" | "month" | "year";

export type QuickOption = {
    label: string;
    getDate: () => Date;
    getDateFormat: () => string;
};

export type UseCalendarProps = {
    value?: Date | null;
    defaultValue?: Date | null;
    minDate?: Date;
    maxDate?: Date;
    disabledDates?: CalendarDisabledDateInput | CalendarDisabledDateInput[];
    disableQuickOptions?: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[];
    range?: boolean;
    rangeValue?: CalendarRangeValue;
    defaultRangeValue?: CalendarRangeValue;
    selectYear?: boolean;
    /** First day of the week for the month grid. 0 = Sunday, 1 = Monday. @default 0 */
    weekStartsOn?: CalendarWeekStartDay;
    onChange?: (date: Date | null, meta?: { source: CalendarChangeSource }) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    formValue?: unknown;
    inForm?: boolean;
    name?: string;
    formSetFieldValue?: (name: string, value: any) => void;
};

export type UseCalendarReturn = {
    current: Date | null;
    visibleMonth: Date;
    visibleYear: number;
    visibleLabel: string;
    currentRange: CalendarRangeValue;
    today: Date;
    weekStartsOn: CalendarWeekStartDay;

    days: Date[];
    daysInMonth: Date[];
    weeks: Date[][];
    weekDays: string[];
    gridStart: Date;
    gridEnd: Date;
    weekStart: Date;
    weekEnd: Date;
    isRangeMode: boolean;
    showQuickOptions: boolean;
    visibleQuickOptions: QuickOption[];
    isDateDisabled: (date: Date) => boolean;
    isToday: (date: Date) => boolean;
    isSelected: (date: Date) => boolean;
    isInRange: (date: Date) => boolean;

    disablePrevDay: boolean;
    disableNextDay: boolean;
    disablePrevWeek: boolean;
    disableNextWeek: boolean;
    disablePrevMonth: boolean;
    disableNextMonth: boolean;
    disablePrevYear: boolean;
    disableNextYear: boolean;

    rangeStart: Date | null;
    rangeEnd: Date | null;

    yearOptions: { label: string; value: string }[];
    monthOptions: { label: string; value: string }[];
    selectedYearOption: { label: string; value: string } | null;
    selectedMonthOption: { label: string; value: string } | null;

    handleDateClick: (date: Date) => void;
    selectDate: (date: Date) => void;
    clearSelection: () => void;
    clearRange: () => void;
    setRange: (range: CalendarRangeValue) => void;

    goto: (unit: CalendarNavUnit, amount?: number) => void;
    canGoto: (unit: CalendarNavUnit, amount?: number) => boolean;
    gotoDate: (date: Date, options?: { select?: boolean }) => void;
    gotoToday: () => void;
    gotoPrevDay: () => void;
    gotoNextDay: () => void;
    gotoPrevWeek: () => void;
    gotoNextWeek: () => void;
    gotoPrevMonth: () => void;
    gotoNextMonth: () => void;
    gotoPrevYear: () => void;
    gotoNextYear: () => void;

    handleYearChange: (yearValue: string | number) => void;
    handleMonthChange: (monthValue: string | number) => void;
    setVisibleMonth: (date: Date) => void;
    setCurrent: (date: Date | null) => void;
    setCurrentRange: (range: CalendarRangeValue) => void;

    getDayProps: (day: Date) => {
        isCurrentMonth: boolean;
        isDisabled: boolean;
        isSelected: boolean;
        isCurrentDay: boolean;
        isRangeStart: boolean;
        isRangeEnd: boolean;
        isRangeDay: boolean;
        isMiddleRangeDay: boolean;
    };
};

// Constants
const _quickDateOptions: QuickOption[] = [
    { 
        label: 'Today', 
        getDate: () => new Date(),
        getDateFormat: () => format(new Date(), 'EEE'),
    },
    { 
        label: 'Later', 
        getDate: () => new Date(),
        getDateFormat: () => format(addHours(new Date(), 2), 'hh:mm a'),
    },
    { 
        label: 'Tomorrow', 
        getDate: () => addDays(new Date(), 1),
        getDateFormat: () => format(addDays(new Date(), 1), 'EEE'),
    },
    { 
        label: 'This weekend', 
        getDate: () => {
            const today = new Date();
            const day = today.getDay();
            return addDays(today, (6 - day) % 7 || 6);
        },
        getDateFormat: () => {
            const today = new Date();
            const day = today.getDay();
            return format(addDays(today, (6 - day) % 7 || 6), 'EEE, MMM d')
        },
    },
    { 
        label: 'Next week', 
        getDateFormat: () => format(addWeeks(new Date(), 1), 'EEE, MMM d'),
        getDate: () => addWeeks(new Date(), 1) 
    },
    { 
        label: 'Next weekend', 
        getDateFormat: () => format(addWeeks(new Date(), 1), 'd MMM'),
        getDate: () => addWeeks(new Date(), 1) 
    },
    { 
        label: '2 weeks', 
        getDateFormat: () => format(addWeeks(new Date(), 2), 'd MMM'),
        getDate: () => addWeeks(new Date(), 2) 
    },
    { 
        label: '4 weeks', 
        getDateFormat: () => format(addWeeks(new Date(), 4), 'd MMM'),
        getDate: () => addWeeks(new Date(), 4) 
    },
];

// Helper functions
const dedupeByDate = <T extends QuickOption>(options: readonly T[]): T[] => {
    const seen = new Set<string>();
    return options.filter((opt) => {
        if (opt.label === `Later`) return true;
        const iso = opt.getDate().toISOString().split('T')[0];
        if (seen.has(iso)) return false;
        seen.add(iso);
        return true;
    });
};

const normalizeDisabledDateInput = (input: CalendarDisabledDateInput): Date | null => {
    if (input instanceof Date) {
        return isValid(input) ? input : null;
    }

    const nativeDate = new Date(input);
    if (isValid(nativeDate)) return nativeDate;

    const fallbackFormats = [
        "yyyy-MM-dd",
        "MM-dd-yyyy",
        "MM/dd/yyyy",
        "dd-MM-yyyy",
        "dd/MM/yyyy",
    ];

    for (const dateFormat of fallbackFormats) {
        const parsedDate = parse(input, dateFormat, new Date());
        if (isValid(parsedDate)) return parsedDate;
    }

    return null;
};

const quickOptionLabelSet = new Set<CalendarQuickOptionLabel>(
    _quickDateOptions.map((option) => option.label as CalendarQuickOptionLabel)
);

const normalizeQuickOptionFilters = (
    input: boolean | CalendarQuickOptionInput | CalendarQuickOptionInput[] | undefined,
) => {
    if (input === true) return true;
    if (!input) return null;

    const hiddenLabels = new Set<string>();
    const hiddenDates = new Set<string>();
    const values = Array.isArray(input) ? input : [input];

    values.forEach((value) => {
        if (value instanceof Date) {
            const normalizedDate = normalizeDisabledDateInput(value);
            if (normalizedDate) {
                hiddenDates.add(startOfDay(normalizedDate).toISOString().split("T")[0]);
            }
            return;
        }

        const normalizedText = String(value).trim();
        if (!normalizedText) return;

        if (quickOptionLabelSet.has(normalizedText as CalendarQuickOptionLabel)) {
            hiddenLabels.add(normalizedText.toLowerCase());
            return;
        }

        const normalizedDate = normalizeDisabledDateInput(normalizedText);
        if (normalizedDate) {
            hiddenDates.add(startOfDay(normalizedDate).toISOString().split("T")[0]);
        }
    });

    return { hiddenLabels, hiddenDates };
};

const parseFormValue = (val: unknown): Date | null => {
    if (!val) return null;
    if (val instanceof Date) return val;
    if (typeof val === 'string') {
        const parsed = new Date(val);
        return isValid(parsed) ? parsed : null;
    }
    return null;
};

/**
 * Calendar state, month grid, range selection, and navigation.
 *
 * @example
 * ```tsx
 * const calendar = useCalendar({
 *   onChange: (date) => console.log(date),
 *   minDate: new Date(2024, 0, 1),
 *   weekStartsOn: 1,
 * });
 *
 * calendar.gotoToday();
 * calendar.goto("week", 1);
 * calendar.gotoPrevMonth();
 * ```
 */
export const useCalendar = (props: UseCalendarProps = {}): UseCalendarReturn => {
    const {
        value,
        defaultValue,
        minDate,
        maxDate,
        disabledDates,
        disableQuickOptions,
        range,
        rangeValue,
        defaultRangeValue,
        selectYear,
        weekStartsOn = 0,
        onChange,
        onRangeChange,
        formValue,
        inForm,
        name,
        formSetFieldValue,
    } = props;
    
    const isRangeMode = !!range;
    
    // State
    const [current, setCurrent] = useState<Date | null>(() => {
        if (value !== undefined) return value ?? new Date();
        if (inForm && formValue) return parseFormValue(formValue) ?? defaultValue ?? new Date();
        return defaultValue ?? new Date();
    });
    
    const [visibleMonth, setVisibleMonth] = useState(() => {
        const initialDate = (() => {
            if (value !== undefined) return value ?? new Date();
            if (inForm && formValue) return parseFormValue(formValue) ?? defaultValue ?? new Date();
            return defaultValue ?? new Date();
        })();
        return startOfMonth(initialDate);
    });
    
    const [currentRange, setCurrentRange] = useState<CalendarRangeValue>(
        rangeValue ?? defaultRangeValue ?? { start: null, end: null }
    );
    
    // Sync controlled value
    useEffect(() => {
        if (typeof value !== "undefined") {
            const nextDate = value ?? new Date();
            setCurrent(nextDate);
            setVisibleMonth(startOfMonth(nextDate));
        }
    }, [value]);
    
    useEffect(() => {
        if (typeof rangeValue !== "undefined") {
            setCurrentRange(rangeValue);
        }
    }, [rangeValue]);
    
    // Computed values
    const minDateDay = useMemo(() => (minDate ? startOfDay(minDate) : null), [minDate]);
    const maxDateDay = useMemo(() => (maxDate ? startOfDay(maxDate) : null), [maxDate]);
    
    const disabledDateSet = useMemo(() => {
        const set = new Set<string>();
        const values = Array.isArray(disabledDates)
            ? disabledDates
            : disabledDates != null
                ? [disabledDates]
                : [];

        values.forEach((value) => {
            const date = normalizeDisabledDateInput(value);
            if (!date) return;
            set.add(startOfDay(date).toISOString().split('T')[0]);
        });
        return set;
    }, [disabledDates]);
    
    const hiddenQuickOptionFilters = useMemo(() => {
        return normalizeQuickOptionFilters(disableQuickOptions);
    }, [disableQuickOptions]);
    
    // Month computation
    const monthStart = useMemo(() => startOfMonth(visibleMonth), [visibleMonth]);
    const monthEnd = useMemo(() => endOfMonth(visibleMonth), [visibleMonth]);
    const gridStart = useMemo(() => startOfWeek(monthStart, { weekStartsOn }), [monthStart, weekStartsOn]);
    const gridEnd = useMemo(() => endOfWeek(monthEnd, { weekStartsOn }), [monthEnd, weekStartsOn]);
    const today = startOfDay(new Date());
    const visibleYear = visibleMonth.getFullYear();
    const visibleLabel = useMemo(() => format(visibleMonth, "MMMM yyyy"), [visibleMonth]);
    
    const days = useMemo(() => 
        eachDayOfInterval({ start: gridStart, end: gridEnd }),
    [gridStart, gridEnd]);

    const daysInMonth = useMemo(() =>
        eachDayOfInterval({ start: monthStart, end: monthEnd }),
    [monthStart, monthEnd]);

    const weeks = useMemo(() => {
        const rows: Date[][] = [];
        for (let i = 0; i < days.length; i += 7) {
            rows.push(days.slice(i, i + 7));
        }
        return rows;
    }, [days]);

    const weekDays = useMemo(() => {
        const start = startOfWeek(new Date(), { weekStartsOn });
        return Array.from({ length: 7 }, (_, index) => format(addDays(start, index), "EEEEEE"));
    }, [weekStartsOn]);
    
    // Date disabled check
    const isDateDisabled = useCallback((date: Date) => {
        const day = startOfDay(date);
        const dayKey = day.toISOString().split('T')[0];
        if (disabledDateSet.has(dayKey)) return true;
        if (minDateDay && isBefore(day, minDateDay)) return true;
        if (maxDateDay && isAfter(day, maxDateDay)) return true;
        return false;
    }, [disabledDateSet, minDateDay, maxDateDay]);
    
    // Find selectable date in month
    const findSelectableDateInMonth = useCallback((monthDate: Date, preferredDay: number) => {
        const monthStartDate = startOfMonth(monthDate);
        const monthEndDate = endOfMonth(monthDate);
        const maxDay = monthEndDate.getDate();
        const normalizedPreferredDay = Math.min(Math.max(1, preferredDay || 1), maxDay);
        const maxOffset = Math.max(normalizedPreferredDay - 1, maxDay - normalizedPreferredDay);

        for (let offset = 0; offset <= maxOffset; offset += 1) {
            const previousDay = normalizedPreferredDay - offset;
            if (previousDay >= 1) {
                const previousCandidate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), previousDay);
                if (!isDateDisabled(previousCandidate)) {
                    return previousCandidate;
                }
            }

            if (offset === 0) continue;

            const nextDay = normalizedPreferredDay + offset;
            if (nextDay <= maxDay) {
                const nextCandidate = new Date(monthStartDate.getFullYear(), monthStartDate.getMonth(), nextDay);
                if (!isDateDisabled(nextCandidate)) {
                    return nextCandidate;
                }
            }
        }

        return null;
    }, [isDateDisabled]);
    
    // Quick options
    const visibleQuickOptions = useMemo(() => {
        if (hiddenQuickOptionFilters === true) return [];

        return dedupeByDate(_quickDateOptions).filter((option) => {
            if (!hiddenQuickOptionFilters) return true;

            const optionDayKey = startOfDay(option.getDate()).toISOString().split("T")[0];
            if (hiddenQuickOptionFilters.hiddenLabels.has(option.label.trim().toLowerCase())) return false;
            if (hiddenQuickOptionFilters.hiddenDates.has(optionDayKey)) return false;
            return true;
        });
    }, [hiddenQuickOptionFilters]);

    const showQuickOptions = visibleQuickOptions.length > 0;
    
    const prevMonthEnd = useMemo(() => endOfMonth(addMonths(visibleMonth, -1)), [visibleMonth]);
    const nextMonthStart = useMemo(() => startOfMonth(addMonths(visibleMonth, 1)), [visibleMonth]);
    const prevYearEnd = useMemo(() => endOfYear(addYears(visibleMonth, -1)), [visibleMonth]);
    const nextYearStart = useMemo(() => startOfYear(addYears(visibleMonth, 1)), [visibleMonth]);
    const disablePrevMonth = useMemo(() => !!minDateDay && isBefore(prevMonthEnd, minDateDay), [minDateDay, prevMonthEnd]);
    const disableNextMonth = useMemo(() => !!maxDateDay && isAfter(nextMonthStart, maxDateDay), [maxDateDay, nextMonthStart]);
    const disablePrevYear = useMemo(() => !!minDateDay && isBefore(prevYearEnd, minDateDay), [minDateDay, prevYearEnd]);
    const disableNextYear = useMemo(() => !!maxDateDay && isAfter(nextYearStart, maxDateDay), [maxDateDay, nextYearStart]);

    const anchorDate = startOfDay(current ?? visibleMonth);
    const weekStart = useMemo(() => startOfWeek(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn]);
    const weekEnd = useMemo(() => endOfWeek(anchorDate, { weekStartsOn }), [anchorDate, weekStartsOn]);

    const findSelectableByStep = useCallback((from: Date, distance: number) => {
        const direction = distance >= 0 ? 1 : -1;
        let candidate = startOfDay(addDays(from, distance));
        for (let i = 0; i < 366; i += 1) {
            if (minDateDay && isBefore(candidate, minDateDay)) return null;
            if (maxDateDay && isAfter(candidate, maxDateDay)) return null;
            if (!isDateDisabled(candidate)) return candidate;
            candidate = addDays(candidate, direction);
        }
        return null;
    }, [isDateDisabled, minDateDay, maxDateDay]);

    const disablePrevDay = !findSelectableByStep(anchorDate, -1);
    const disableNextDay = !findSelectableByStep(anchorDate, 1);
    const disablePrevWeek = !findSelectableByStep(anchorDate, -7);
    const disableNextWeek = !findSelectableByStep(anchorDate, 7);
    
    // Year/Month selectors
    const yearOptions = useMemo(() => {
        if (!selectYear) return [];
        
        const currentYear = new Date().getFullYear();
        const minYear = minDate ? minDate.getFullYear() : currentYear - 50;
        const maxYear = maxDate ? maxDate.getFullYear() : currentYear + 50;
        
        const options = [];
        for (let year = minYear; year <= maxYear; year++) {
            options.push({
                label: String(year),
                value: String(year)
            });
        }
        return options;
    }, [selectYear, minDate, maxDate]);
    
    const monthOptions = useMemo(() => {
        if (!selectYear) return [];
        
        return [
            { label: 'January', value: '0' },
            { label: 'February', value: '1' },
            { label: 'March', value: '2' },
            { label: 'April', value: '3' },
            { label: 'May', value: '4' },
            { label: 'June', value: '5' },
            { label: 'July', value: '6' },
            { label: 'August', value: '7' },
            { label: 'September', value: '8' },
            { label: 'October', value: '9' },
            { label: 'November', value: '10' },
            { label: 'December', value: '11' },
        ];
    }, [selectYear]);
    
    const selectedYearOption = useMemo(() => {
        if (!selectYear || !visibleMonth) return null;
        return {
            label: String(visibleMonth.getFullYear()),
            value: String(visibleMonth.getFullYear())
        };
    }, [selectYear, visibleMonth]);
    
    const selectedMonthOption = useMemo(() => {
        if (!selectYear || !visibleMonth) return null;
        return {
            label: format(visibleMonth, 'MMMM'),
            value: String(visibleMonth.getMonth())
        };
    }, [selectYear, visibleMonth]);
    
    // Range computed
    const rawRangeStart = currentRange.start ? startOfDay(currentRange.start) : null;
    const rawRangeEnd = currentRange.end ? startOfDay(currentRange.end) : null;
    const rangeStart = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeEnd : rawRangeStart;
    const rangeEnd = rawRangeStart && rawRangeEnd && isAfter(rawRangeStart, rawRangeEnd) ? rawRangeStart : rawRangeEnd;
    
    // Handlers
    const commitSelectedDate = useCallback((date: Date, source: CalendarChangeSource) => {
        if (isDateDisabled(date)) return false;
        setCurrent(date);
        setVisibleMonth(startOfMonth(date));
        onChange?.(date, { source });
        if (inForm && name && formSetFieldValue) {
            formSetFieldValue(name, date.toISOString());
        }
        return true;
    }, [isDateDisabled, onChange, inForm, name, formSetFieldValue]);

    const handleDateClick = useCallback((date: Date) => {
        if (isDateDisabled(date)) return;

        if (isRangeMode) {
            const { start, end } = currentRange;
            const selectedDay = startOfDay(date);
            const startDay = start ? startOfDay(start) : null;
            let nextRange: CalendarRangeValue;

            if (!start || (start && end)) {
                nextRange = { start: date, end: null };
            } else if (startDay && isBefore(selectedDay, startDay)) {
                nextRange = { start: date, end: start };
            } else {
                nextRange = { start, end: date };
            }

            setCurrentRange(nextRange);
            onRangeChange?.(nextRange);
            setCurrent(date);
            setVisibleMonth(startOfMonth(date));
            
            if (inForm && name && nextRange.start && nextRange.end && formSetFieldValue) {
                formSetFieldValue(name, {
                    start: nextRange.start.toISOString(),
                    end: nextRange.end.toISOString()
                });
            }
            return;
        }

        commitSelectedDate(date, "day");
    }, [isDateDisabled, isRangeMode, currentRange, onRangeChange, commitSelectedDate, inForm, name, formSetFieldValue]);

    const gotoByDays = useCallback((distance: number) => {
        const nextDate = findSelectableByStep(anchorDate, distance);
        if (!nextDate) return;
        if (isRangeMode) {
            setVisibleMonth(startOfMonth(nextDate));
            return;
        }
        commitSelectedDate(nextDate, Math.abs(distance) === 7 ? "week" : "day");
    }, [anchorDate, findSelectableByStep, isRangeMode, commitSelectedDate]);

    const shiftPeriod = useCallback((nextVisibleMonth: Date, source: CalendarChangeSource) => {
        setVisibleMonth(nextVisibleMonth);
        if (isRangeMode || !current) return;
        const nextDate = findSelectableDateInMonth(nextVisibleMonth, current.getDate());
        if (nextDate) {
            setCurrent(nextDate);
            onChange?.(nextDate, { source });
            return;
        }
        onChange?.(null, { source });
    }, [isRangeMode, current, findSelectableDateInMonth, onChange]);

    const canShiftMonth = useCallback((months: number) => {
        const next = startOfMonth(addMonths(visibleMonth, months));
        if (months < 0) return !(minDateDay && isBefore(endOfMonth(next), minDateDay));
        return !(maxDateDay && isAfter(next, maxDateDay));
    }, [visibleMonth, minDateDay, maxDateDay]);

    const canShiftYear = useCallback((years: number) => {
        const next = addYears(visibleMonth, years);
        if (years < 0) return !(minDateDay && isBefore(endOfYear(next), minDateDay));
        return !(maxDateDay && isAfter(startOfYear(next), maxDateDay));
    }, [visibleMonth, minDateDay, maxDateDay]);

    const canGoto = useCallback((unit: CalendarNavUnit, amount = 1) => {
        if (amount === 0) return true;
        switch (unit) {
            case "day":
                return !!findSelectableByStep(anchorDate, amount);
            case "week":
                return !!findSelectableByStep(anchorDate, amount * 7);
            case "month":
                return canShiftMonth(amount);
            case "year":
                return canShiftYear(amount);
            default:
                return false;
        }
    }, [anchorDate, findSelectableByStep, canShiftMonth, canShiftYear]);

    const goto = useCallback((unit: CalendarNavUnit, amount = 1) => {
        if (!canGoto(unit, amount)) return;
        switch (unit) {
            case "day":
                gotoByDays(amount);
                return;
            case "week":
                gotoByDays(amount * 7);
                return;
            case "month":
                shiftPeriod(startOfMonth(addMonths(visibleMonth, amount)), "month");
                return;
            case "year":
                shiftPeriod(startOfMonth(addYears(visibleMonth, amount)), "year");
                return;
        }
    }, [canGoto, gotoByDays, shiftPeriod, visibleMonth]);

    const gotoDate = useCallback((date: Date, options?: { select?: boolean }) => {
        const next = startOfDay(date);
        setVisibleMonth(startOfMonth(next));
        if (options?.select === false) return;
        if (isRangeMode) {
            setCurrent(next);
            return;
        }
        commitSelectedDate(next, "day");
    }, [isRangeMode, commitSelectedDate]);

    const gotoToday = useCallback(() => {
        setVisibleMonth(startOfMonth(today));
        if (isRangeMode) {
            if (!isDateDisabled(today)) setCurrent(today);
            return;
        }
        if (!isDateDisabled(today)) {
            commitSelectedDate(today, "today");
            return;
        }
        onChange?.(null, { source: "today" });
    }, [today, isRangeMode, isDateDisabled, commitSelectedDate, onChange]);

    const gotoPrevDay = useCallback(() => goto("day", -1), [goto]);
    const gotoNextDay = useCallback(() => goto("day", 1), [goto]);
    const gotoPrevWeek = useCallback(() => goto("week", -1), [goto]);
    const gotoNextWeek = useCallback(() => goto("week", 1), [goto]);
    const gotoPrevMonth = useCallback(() => goto("month", -1), [goto]);
    const gotoNextMonth = useCallback(() => goto("month", 1), [goto]);
    const gotoPrevYear = useCallback(() => goto("year", -1), [goto]);
    const gotoNextYear = useCallback(() => goto("year", 1), [goto]);

    const clearSelection = useCallback(() => {
        setCurrent(null);
        onChange?.(null, { source: "day" });
        if (inForm && name && formSetFieldValue) {
            formSetFieldValue(name, null);
        }
    }, [onChange, inForm, name, formSetFieldValue]);

    const setRange = useCallback((range: CalendarRangeValue) => {
        setCurrentRange(range);
        onRangeChange?.(range);
    }, [onRangeChange]);

    const clearRange = useCallback(() => {
        const empty = { start: null, end: null };
        setCurrentRange(empty);
        onRangeChange?.(empty);
    }, [onRangeChange]);
    
    const handleYearChange = useCallback((yearValue: string | number) => {
        const year = Number(yearValue);
        const newDate = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
        newDate.setFullYear(year);
        setVisibleMonth(startOfMonth(newDate));
    }, [visibleMonth]);
    
    const handleMonthChange = useCallback((monthValue: string | number) => {
        const month = Number(monthValue);
        const newDate = new Date(visibleMonth.getFullYear(), month, 1);
        setVisibleMonth(startOfMonth(newDate));
    }, [visibleMonth]);
    
    const isTodayDate = useCallback((date: Date) => isToday(date), []);
    const isSelectedDate = useCallback((date: Date) => !!current && isSameDay(date, current), [current]);
    const isInRange = useCallback((date: Date) => {
        if (!rangeStart || !rangeEnd) return false;
        return isWithinInterval(startOfDay(date), { start: rangeStart, end: rangeEnd });
    }, [rangeStart, rangeEnd]);

    const getDayProps = useCallback((day: Date) => {
        const isCurrentMonth = isSameMonth(day, visibleMonth);
        const isDisabled = !isCurrentMonth || isDateDisabled(day);
        const isSelected = !isDisabled && !!current && isSameDay(day, current);
        const isCurrentDay = isToday(day);
        const isRangeStart = !!rangeStart && isSameDay(day, rangeStart);
        const isRangeEnd = !!rangeEnd && isSameDay(day, rangeEnd);
        const isRangeDay = !!rangeStart && !!rangeEnd && isWithinInterval(day, { start: rangeStart, end: rangeEnd });
        const isMiddleRangeDay = isRangeDay && !isRangeStart && !isRangeEnd;
        
        return {
            isCurrentMonth,
            isDisabled,
            isSelected,
            isCurrentDay,
            isRangeStart,
            isRangeEnd,
            isRangeDay,
            isMiddleRangeDay,
        };
    }, [visibleMonth, isDateDisabled, current, rangeStart, rangeEnd]);
    
    return {
        current,
        visibleMonth,
        visibleYear,
        visibleLabel,
        currentRange,
        today,
        weekStartsOn,

        days,
        daysInMonth,
        weeks,
        weekDays,
        gridStart,
        gridEnd,
        weekStart,
        weekEnd,
        isRangeMode,
        showQuickOptions,
        visibleQuickOptions,
        isDateDisabled,
        isToday: isTodayDate,
        isSelected: isSelectedDate,
        isInRange,

        disablePrevDay,
        disableNextDay,
        disablePrevWeek,
        disableNextWeek,
        disablePrevMonth,
        disableNextMonth,
        disablePrevYear,
        disableNextYear,

        rangeStart,
        rangeEnd,

        yearOptions,
        monthOptions,
        selectedYearOption,
        selectedMonthOption,

        handleDateClick,
        selectDate: handleDateClick,
        clearSelection,
        clearRange,
        setRange,

        goto,
        canGoto,
        gotoDate,
        gotoToday,
        gotoPrevDay,
        gotoNextDay,
        gotoPrevWeek,
        gotoNextWeek,
        gotoPrevMonth,
        gotoNextMonth,
        gotoPrevYear,
        gotoNextYear,

        handleYearChange,
        handleMonthChange,
        setVisibleMonth,
        setCurrent,
        setCurrentRange,

        getDayProps,
    };
};

export default useCalendar;
