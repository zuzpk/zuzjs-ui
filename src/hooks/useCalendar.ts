"use client";
import { addDays, addHours, addWeeks, eachDayOfInterval, endOfMonth, endOfWeek, format, isAfter, isBefore, isSameDay, isSameMonth, isToday, isValid, isWithinInterval, parse, startOfDay, startOfMonth, startOfWeek } from "date-fns";
import { useCallback, useEffect, useMemo, useState } from "react";

// Import types from Calendar types - these are exported from the main index
import type { 
    CalendarQuickOptionLabel,
    CalendarDisabledDateInput,
    CalendarQuickOptionInput,
    CalendarRangeValue
} from "../comps/Calendar/types";

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
    onChange?: (date: Date | null, meta?: { source: "day" | "month" | "time" }) => void;
    onRangeChange?: (range: CalendarRangeValue) => void;
    formValue?: unknown;
    inForm?: boolean;
    name?: string;
    formSetFieldValue?: (name: string, value: any) => void;
};

export type UseCalendarReturn = {
    // State
    current: Date | null;
    visibleMonth: Date;
    currentRange: CalendarRangeValue;
    
    // Computed
    days: Date[];
    isRangeMode: boolean;
    showQuickOptions: boolean;
    visibleQuickOptions: QuickOption[];
    isDateDisabled: (date: Date) => boolean;
    disablePrevMonth: boolean;
    disableNextMonth: boolean;
    
    // Range computed
    rangeStart: Date | null;
    rangeEnd: Date | null;
    
    // SelectYear mode
    yearOptions: { label: string; value: string }[];
    monthOptions: { label: string; value: string }[];
    selectedYearOption: { label: string; value: string } | null;
    selectedMonthOption: { label: string; value: string } | null;
    
    // Actions
    handleDateClick: (date: Date) => void;
    gotoPrevMonth: () => void;
    gotoNextMonth: () => void;
    handleYearChange: (yearValue: string | number) => void;
    handleMonthChange: (monthValue: string | number) => void;
    setVisibleMonth: (date: Date) => void;
    setCurrent: (date: Date | null) => void;
    setCurrentRange: (range: CalendarRangeValue) => void;
    
    // Day rendering helpers
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
 * Custom hook for Calendar component logic
 * 
 * @example
 * ```tsx
 * const calendar = useCalendar({
 *   onChange: (date) => console.log(date),
 *   minDate: new Date(2024, 0, 1),
 *   maxDate: new Date()
 * });
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
    const startDate = useMemo(() => startOfWeek(monthStart), [monthStart]);
    const endDate = useMemo(() => endOfWeek(monthEnd), [monthEnd]);
    
    const days = useMemo(() => 
        eachDayOfInterval({ start: startDate, end: endDate }),
    [startDate, endDate]);
    
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
    
    // Month navigation
    const prevMonthEnd = useMemo(() => endOfMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)), [visibleMonth]);
    const nextMonthStart = useMemo(() => startOfMonth(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)), [visibleMonth]);
    const disablePrevMonth = useMemo(() => !!minDateDay && isBefore(prevMonthEnd, minDateDay), [minDateDay, prevMonthEnd]);
    const disableNextMonth = useMemo(() => !!maxDateDay && isAfter(nextMonthStart, maxDateDay), [maxDateDay, nextMonthStart]);
    
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
            
            // Update form value
            if (inForm && name && nextRange.start && nextRange.end && formSetFieldValue) {
                formSetFieldValue(name, {
                    start: nextRange.start.toISOString(),
                    end: nextRange.end.toISOString()
                });
            }
            return;
        }

        onChange?.(date, { source: "day" });
        setCurrent(date);
        setVisibleMonth(startOfMonth(date));
        
        // Update form value
        if (inForm && name && formSetFieldValue) {
            formSetFieldValue(name, date.toISOString());
        }
    }, [isDateDisabled, isRangeMode, currentRange, onRangeChange, onChange, inForm, name, formSetFieldValue]);
    
    const gotoPrevMonth = useCallback(() => {
        setVisibleMonth((prevVisibleMonth) => {
            const nextVisibleMonth = startOfMonth(new Date(prevVisibleMonth.getFullYear(), prevVisibleMonth.getMonth() - 1, 1));

            if (!isRangeMode && current) {
                const preferredDay = current.getDate();
                const nextDate = findSelectableDateInMonth(nextVisibleMonth, preferredDay);

                if (nextDate) {
                    setCurrent(nextDate);
                    onChange?.(nextDate, { source: "month" });
                } else {
                    onChange?.(null, { source: "month" });
                }
            }

            return nextVisibleMonth;
        });
    }, [isRangeMode, current, findSelectableDateInMonth, onChange]);
    
    const gotoNextMonth = useCallback(() => {
        setVisibleMonth((prevVisibleMonth) => {
            const nextVisibleMonth = startOfMonth(new Date(prevVisibleMonth.getFullYear(), prevVisibleMonth.getMonth() + 1, 1));

            if (!isRangeMode && current) {
                const preferredDay = current.getDate();
                const nextDate = findSelectableDateInMonth(nextVisibleMonth, preferredDay);

                if (nextDate) {
                    setCurrent(nextDate);
                    onChange?.(nextDate, { source: "month" });
                } else {
                    onChange?.(null, { source: "month" });
                }
            }

            return nextVisibleMonth;
        });
    }, [isRangeMode, current, findSelectableDateInMonth, onChange]);
    
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
    
    // Day props helper
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
        // State
        current,
        visibleMonth,
        currentRange,
        
        // Computed
        days,
        isRangeMode,
        showQuickOptions,
        visibleQuickOptions,
        isDateDisabled,
        disablePrevMonth,
        disableNextMonth,
        
        // Range computed
        rangeStart,
        rangeEnd,
        
        // SelectYear mode
        yearOptions,
        monthOptions,
        selectedYearOption,
        selectedMonthOption,
        
        // Actions
        handleDateClick,
        gotoPrevMonth,
        gotoNextMonth,
        handleYearChange,
        handleMonthChange,
        setVisibleMonth,
        setCurrent,
        setCurrentRange,
        
        // Day rendering helpers
        getDayProps,
    };
};

export default useCalendar;
