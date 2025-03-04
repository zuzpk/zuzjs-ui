"use client"
import { forwardRef, useMemo } from "react";
import { useDelayed } from "../..";
import { ColorScheme, useColorScheme } from "../../hooks/useColorScheme";
import Segmented from "../Segmented";
import { SegmentProps } from "../Segmented/types";
import SVGIcons from "../svgicons";

const ColorScheme = forwardRef<HTMLDivElement, Omit<SegmentProps, `items`>>((props, ref) => {

    const mounted = useDelayed()
    const { colorScheme, setColorScheme } = useColorScheme()
    const items = useMemo(() => [
        { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
        { tag: `system`, index: 1, label: "", icon: SVGIcons.colorSchemeSystem },
        { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
    ], [])
    
    const selected = useMemo(() => [`light`,`system`,`dark`].indexOf(colorScheme), [colorScheme])
    
    if ( !mounted || selected == -1 ) return null;

    return <Segmented 
        className={`--color-scheme`}
        onSwitch={({ tag }) => {
            setColorScheme(tag! as ColorScheme)
        }}
        selected={selected}
        items={items}
        {...props}
    />

})

ColorScheme.displayName = `ColorScheme`

export default ColorScheme