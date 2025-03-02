import { CalendarMonthFormat, CalendarWeekdayFormat } from "../types";
declare const useCalendar: (range?: number, dayFormat?: CalendarWeekdayFormat, monthFormat?: CalendarMonthFormat) => {
    today: Date;
    daysCount: number;
    month: string;
    day: string;
    days: {
        day: string;
        date: number;
        month: string;
        year: number;
    }[];
    next: () => void;
    prev: () => void;
};
export default useCalendar;
