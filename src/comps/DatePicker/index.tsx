
import { format } from "date-fns";
import { forwardRef, useEffect, useRef, useState } from "react";
import { useBase, usePosition } from "../../hooks";
import { Position } from "../../types/enums";
import Box from "../Box";
import Calendar from "../Calendar";
import Icon from "../Icon";
import Span from "../Span";
import SVGIcons from "../svgicons";
import { DatePickerProps } from "./types";



const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>((props, ref) => {

    const { icon, defaultValue, value, size, variant, numeric, type, onConfirm, ...pops } = props
    const [ choosing, setChoosing ] = useState(false);
    const [ currentDate, setCurrentDate ] = useState<Date | null>(defaultValue || null);
    const {
        style,
        className,
        rest
    } = useBase<"input">(pops)
    const _input = useRef<HTMLInputElement>(null);
    const _pop = useRef<HTMLDivElement>(null);
    
    const { reposition } = usePosition(_pop as any, { direction: Position.Bottom, offset: 2 })

    const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
        if (numeric ) {
            event.currentTarget.value = event.currentTarget.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');            
        }
    }

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            
            const target = e.target as Node;

            const clickedInsideInput = _input.current?.contains(target);
            const clickedInsidePop = _pop.current?.contains(target);

            if (!clickedInsideInput && !clickedInsidePop) {
                setChoosing(false);
            }

        };

        if (choosing) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [choosing]);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape" && choosing) {
                setChoosing(false);
                _input.current?.focus();
            }
        };

        document.addEventListener("keydown", handleEsc);
        return () => document.removeEventListener("keydown", handleEsc);
    }, [choosing]);

    const handleFocus = () => {
        setChoosing(true);
    };

    useEffect(() => {
        if (choosing) {
        reposition();
        }
    }, [choosing, reposition]);
 
    return <><Box as={`--date-picker ${variant ? `--${variant}` : ``} rel flex aic ${className}`} data-value={currentDate ? currentDate.toISOString() : ``} >
        { icon ? `string` === typeof icon ? <Icon as={`mr:10 c:#666`} name={icon} /> : icon : <Span as={`--date-picker-icon flex aic jcc`}>{SVGIcons.calendar}</Span> }
        <input
            ref={_input}
            value={currentDate ? format(currentDate, `EEE, MMM d YYY hh:mm a`) : (value || ``)}
            className={`--input ${variant ? `--${variant}` : ``} flex`.trim()}
            style={style}
            onFocus={handleFocus}
            onInput={handleInput}
            autoComplete="new-password"
            onKeyDown={(e) => {
                if ( e.key == `Enter` ){
                    onConfirm?.(e.currentTarget.value);
                }
            }}
            {...rest} />
        <Box 
            aria-hidden={!choosing}
            ref={_pop}
            fx={{
                from: { y: 5, opacity: 0 },
                to: { y: 0, opacity: 1 },
                when: choosing,
                duration: .05
            }}
            as={`--date-picker-chooser flex aic ${variant ? `--${variant}` : ``}`}>
            <Calendar 
                defaultValue={currentDate}
                onChange={dt => {
                    setCurrentDate(dt)
                    setChoosing(false)
                }} />
        </Box>
    </Box>
    </>
})

DatePicker.displayName = `Zuz.DatePicker`

export default DatePicker