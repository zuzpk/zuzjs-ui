'use client';
import { useState } from "react";
const isLeapYear = (year) => {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
};
const getDaysInMonth = (month, year) => {
    switch (month) {
        case 1: // February
            return isLeapYear(year) ? 29 : 28;
        case 3:
        case 5:
        case 8:
        case 10: // April, June, September, November
            return 30;
        default:
            return 31;
    }
};
const getDayName = (date, format) => {
    return date.toLocaleString('default', { weekday: format });
};
const getMonthName = (month, format) => {
    const date = new Date();
    date.setMonth(month);
    return date.toLocaleString('default', { month: format });
};
const useCalendar = (range = 1, dayFormat, monthFormat) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const next = () => {
        setCurrentDate(prevDate => {
            const nextDate = new Date(prevDate);
            nextDate.setMonth(prevDate.getMonth() + range);
            return nextDate;
        });
    };
    const prev = () => {
        setCurrentDate(_prevDate => {
            const prevDate = new Date(_prevDate);
            prevDate.setMonth(prevDate.getMonth() - range);
            return prevDate;
        });
    };
    const daysCount = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());
    const month = getMonthName(currentDate.getMonth(), monthFormat || "long");
    const day = getDayName(currentDate, dayFormat || "short");
    const days = Array.from({ length: daysCount }, (_, index) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), index + 1);
        return {
            day: getDayName(date, dayFormat || "short"),
            date: date.getDate(),
            month: getMonthName(date.getMonth(), monthFormat || "long"),
            year: date.getFullYear(),
        };
    });
    return {
        today: currentDate,
        daysCount,
        month,
        day,
        days,
        next,
        prev,
    };
};
export default useCalendar;
