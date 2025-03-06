'use client'
import { forwardRef, useEffect, useRef, useState } from "react";
import { useBase } from "../../hooks";
import { Size } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import SegmentItem from "./item";
import { Segment, SegmentProps } from "./types";


/**
 * `SelectTabs` component is a segmented control that allows switching between segments.
 *
 * @component
 * @param {SegmentProps} props - Props for the segmented control component.
 * @param {React.Ref<HTMLDivElement>} ref - Ref for the root div element.
 * @returns {JSX.Element} The rendered segmented control.
 *
 * @example
 * // Usage example
 * const segments = [
 *   { index: 0, label: "Home", icon: "home_icon" },
 *   { index: 1, label: "Profile", icon: "profile_icon" },
 *   { index: 2, label: "Settings", icon: "settings_icon" }
 * ];
 * 
 * <SelectTabs selected={1} items={segments} />
 */
const Segmented = forwardRef<HTMLDivElement, SegmentProps>((props, ref) => {

    const { animate, fx, items, selected, size, onSwitch, ...pops } = props
    const [ _selected, setSelected ] = useState(selected || 0)
    const { className, style, rest } = useBase(pops)
    const _tab = useRef<HTMLDivElement | null>(null)
    const _segmented = useRef<HTMLDivElement | null>(null)
    
    /**
     * Handles selection of a segment.
     *
     * @param {number} index - The index of the selected segment.
     * @param {number} width - The width of the selected segment.
     * @param {number} x - The x-coordinate of the selected segment.
     */
    const handleSelect = (index: number, width: number, x: number, meta: Segment, force: boolean) => {
        // console.log(selected, _selected, index, mounted)
        if ( force || ( _selected != index && _selected != -2 ) ){
            setSelected(index)
            if ( onSwitch ) onSwitch(meta)
        }
        if ( _tab.current ) {
            const _sp = _segmented.current?.getBoundingClientRect()
            _tab.current.style.setProperty(`--w`, `${width}px`)
            _tab.current.style.setProperty(`--x`, `${_sp ? x - _sp.left : x}px`);
        }
    }

    useEffect(() => {
        if (selected !== undefined && selected != _selected) {
            setSelected(selected);
        }
    }, [selected, _selected]);

    return <Box
        ref={_segmented}
        data-selected={_selected}
        className={`${className} --segmented --${size || Size.Small} flex aic rel`}
        style={style}
        {...rest as BoxProps}>

        <Box ref={_tab} className={`--segment-tab abs`} />

        {items.map((item, i) => <SegmentItem
            onSelect={handleSelect}
            selected={_selected == i} 
            key={`segment-${item.label}-${i}`} 
            meta={{
                ...item,
                index: i
            }} 
        />)}

    </Box>


})

Segmented.displayName = `SelectTabs`

export default Segmented;