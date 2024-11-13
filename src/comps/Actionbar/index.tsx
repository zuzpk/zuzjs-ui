"use client"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import Box, { BoxProps } from "../Box";
import { useBase } from "../../hooks";
import { ActionBarHandler, ActionBarProps } from "./types";
import ActionItem from "./item";


/**
 * ActionBar renders a list of buttons with tooltips.
 * 
 * @example
 * ```tsx
 * const items = [
 *   { label: 'Edit', icon: <EditIcon />, onClick: () => console.log('Edit clicked') },
 *   { label: 'Delete', icon: <DeleteIcon />, onClick: () => console.log('Delete clicked') }
 * ];
 * 
 * <ActionBar items={items} />
 * ```
 */
const ActionBar = forwardRef<ActionBarHandler, ActionBarProps>((props, ref) => {

    const { items, name, selected, ...pops } = props
    
    const self = useRef<HTMLDivElement>(null)

    const [ _selected, setSelected ] = useState(selected || items[0].tag || 0)

    const track = useCallback(({ x, y } : MouseEvent) => {
        if ( self.current ){
            const bounds = self.current.getBoundingClientRect()
            document.documentElement.style.setProperty(`--tip-x`, `${x - bounds.left}`)
            document.documentElement.style.setProperty(`--tip-y`, `${y - bounds.top}`)
            document.documentElement.style.setProperty(`--tip-s`, `1`)
        }
    }, [])

    const tear = useCallback(() => {
        if ( self.current ){
            self.current.removeEventListener(`pointerleave`, tear)
            self.current.removeEventListener(`pointermove`, track)
            document.documentElement.style.setProperty(`--tip-s`, `0`)
        }
    }, [])

    const initTrack = useCallback(() => {
        if ( self.current ){
            self.current.addEventListener(`pointerleave`, tear)
            self.current.addEventListener(`pointermove`, track)
        }
    }, [])

    useEffect(() => {
        if ( self.current ){
            document.documentElement.style.setProperty(`--tip-w`, items.reduce((longest, item) => {
                return item.label.length > longest.length ? item.label : longest;
            }, '').length.toString())
            document.documentElement.style.setProperty(`--tip-s`, `0`)
            document.documentElement.style.setProperty(`--tip-l`, `${items.length}`)
            self.current?.addEventListener(`pointerenter`, initTrack)
        }
    }, [])

    const {
        className,
        style,
        rest
    } = useBase(pops)


    return <Box 
        ref={self}
        style={style}
        className={`--actionbar rel flex aic ${className}`.trim()}
        {...rest as BoxProps}>

        {items.map((item, index) => <ActionItem 
            selected={_selected === item.tag || selected == index}
            key={`actionbar-action-${item.label.toLowerCase().replace(/\s+/g, `-`)}`} 
            {...{ ...item, idx: index } }
        />)}

        <Box className={`--tip abs`}>
            <Box className={`--track flex aic`}>
            {items.map(({ label }) => <Box
                key={`tool-tip-${label.toLowerCase().replace(/\s+/g, `-`)}`}
                className={`--lb`}>{label}</Box>)}
            </Box>
        </Box>

    </Box>

})

export default ActionBar;