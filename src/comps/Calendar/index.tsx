"use client";
import { format, isSameDay, isToday, isWithinInterval } from "date-fns";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import useCalendar from "../../hooks/useCalendar";
import { Variant } from "../../types";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import Select from "../Select";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { useFormActions, useFormFieldError, useFormFieldValue } from "../Form/context";
import LargeCalendar from "./LargeCalendar";
import { CalendarProps } from "./types";

/**
 * Calendar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Calendar onChange={(date) => console.log(date)} selected={new Date()} minDate={new Date(2024, 0, 1)} maxDate={new Date()} />
 * ```
 * @param onChange - Callback function triggered when value changes
 * @param selected - Currently selected item/date
 * @param minDate - minDate prop
 * @param maxDate - maxDate prop
 */
const Calendar = forwardRef<HTMLInputElement, CalendarProps>((props, ref) => {

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
        variant,
        onChange,
        onRangeChange,
        selectYear,
        name,
        // Large mode props
        large,
        viewMode = 'week',
        startDate: startDateProp,
        weekStartsOn = 1,
        timeInterval = 60,
        subInterval,
        showSubIntervalLabel = false,
        startHour = 8,
        endHour = 20,
        appointments,
        renderAppointment,
        onTimeSlotClick,
        onAppointmentClick,
        onAppointmentChange,
        enableRangeSelect,
        onTimeRangeSelect,
        disableAfter,
        ...pops
    } = props

    const {
        style,
        className,
        rest
    } = useBase<"div">(pops)
    const theme = useTheme(true)
    const themeVariant = theme?.variant
    const form = useFormActions()
    const error = useFormFieldError(name)
    const formValue = useFormFieldValue(name)
    const inForm = Boolean(name && form?.setFieldValue)
    
    // Use the calendar hook
    const calendar = useCalendar({
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
        formSetFieldValue: form?.setFieldValue,
    });
    
    // Large mode renders its own calendar
    if (large) {
        return (
            <LargeCalendar
                value={calendar.current}
                defaultValue={defaultValue}
                variant={variant}
                themeVariant={themeVariant}
                viewMode={viewMode}
                startDate={startDateProp}
                weekStartsOn={weekStartsOn}
                timeInterval={timeInterval}
                subInterval={subInterval}
                showSubIntervalLabel={showSubIntervalLabel}
                startHour={startHour}
                endHour={endHour}
                appointments={appointments}
                renderAppointment={renderAppointment}
                onTimeSlotClick={onTimeSlotClick}
                onAppointmentClick={onAppointmentClick}
                onAppointmentChange={onAppointmentChange}
                enableRangeSelect={enableRangeSelect}
                onTimeRangeSelect={onTimeRangeSelect}
                disableAfter={disableAfter}
                visibleMonth={calendar.visibleMonth}
                setVisibleMonth={calendar.setVisibleMonth}
                onChange={(date) => {
                    if (date) {
                        calendar.setCurrent(date);
                        onChange?.(date, { source: 'day' });
                        if (inForm && name) {
                            form?.setFieldValue?.(name, date.toISOString());
                        }
                    }
                }}
            />
        );
    }
    
    const calendarRootClassName = [
        `--calendar`,
        `--${variant || themeVariant || Variant.Small}`,
        className,
        !calendar.showQuickOptions ? `--calendar-no-quick-options` : ``,
    ].filter(Boolean).join(` `);

    return (
        <Flex
            as={calendarRootClassName}
            style={style}>
            {calendar.showQuickOptions && (
                <Box as={`--calendar-quick-select flex cols flex:1`}>
                    {calendar.visibleQuickOptions.map((option) => {
                        const date = option.getDate();
                        return (
                            <Button 
                                key={`--dtp-option-label-${option.label}`} 
                                onClick={() => calendar.handleDateClick(date)}
                                as={[
                                    `--calendar-quick-option flex aic gap:5`,
                                ]}>
                                <Text as={`flex:1`}>{option.label}</Text>
                                <Text as={`tar dim-50`}>{option.getDateFormat()}</Text>
                            </Button>
                        );
                    })}
                </Box>
            )}
            <Box as={`--calendar-selector flex cols flex:1`}>
                <Box as={`--calendar-head flex aic jcc gap:4`}>
                    {selectYear ? (
                        <>
                            <Select
                                as={`flex:1 --calendar-cm`}
                                options={calendar.monthOptions}
                                selected={calendar.selectedMonthOption?.value}
                                onChange={(opt) => calendar.handleMonthChange(opt.value)}
                                variant={variant || themeVariant || Variant.Small}
                                kind="plain"
                            />
                            <Select
                                as={`--calendar-cm`}
                                options={calendar.yearOptions}
                                selected={calendar.selectedYearOption?.value}
                                onChange={(opt) => calendar.handleYearChange(opt.value)}
                                variant={variant || themeVariant || Variant.Small}
                                kind="plain"
                            />
                        </>
                    ) : (
                        <Text as={`flex:1 --calendar-cm bold`}>{format(calendar.visibleMonth, 'MMMM yyyy')}</Text>
                    )}
                    <Button 
                        disabled={calendar.disablePrevMonth}
                        onClick={calendar.gotoPrevMonth}
                        as={`--calendar-chevron`}>{SVGIcons.chevronUpOutline}</Button>
                    <Button 
                        disabled={calendar.disableNextMonth}
                        onClick={calendar.gotoNextMonth}
                        as={`--calendar-chevron`}>{SVGIcons.chevronDownOutline}</Button>
                </Box>
                <Box as={`--calendar-days gap:4`}>
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                        <Text key={`--calendar-hd-${day}`} as={`--calendar-day`}>{day}</Text>
                    ))}
                    {calendar.days.map((day, idx) => {
                        const dayProps = calendar.getDayProps(day);
                        
                        return (
                            <Button 
                                key={`--calendar-day-${idx}-${day.getFullYear()}-${day.getMonth()}-${day.getDay()}`}
                                disabled={dayProps.isDisabled}
                                onClick={() => calendar.handleDateClick(day)}
                                variant={variant || themeVariant || Variant.Small}
                                as={[
                                    `--calendar-day --calendar-dd`,
                                    `${!calendar.isRangeMode && dayProps.isSelected ? `--calendar-dd-selected` : ``}`,
                                    `${calendar.isRangeMode && (dayProps.isRangeStart || dayProps.isRangeEnd) ? `--calendar-dd-selected` : ``}`,
                                    `${calendar.isRangeMode && dayProps.isRangeStart ? `--calendar-dd-range-start` : ``}`,
                                    `${calendar.isRangeMode && dayProps.isRangeEnd ? `--calendar-dd-range-end` : ``}`,
                                    `${calendar.isRangeMode && dayProps.isMiddleRangeDay ? `--calendar-dd-range` : ``}`,
                                    `${dayProps.isCurrentDay ? `--calendar-dd-current` : ``}`,
                                ]}>
                                {format(day, 'd')}
                            </Button>
                        );
                    })}
                </Box>
            </Box>
        </Flex>
    );
});

Calendar.displayName = `Zuz.Calendar`;

export default Calendar;
