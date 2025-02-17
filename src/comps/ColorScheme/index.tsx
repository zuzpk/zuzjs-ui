"use client"
import { forwardRef, useEffect, useMemo, useState } from "react";
import { SegmentProps } from "../Segmented/types";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
import { ColorScheme, useColorScheme } from "../../hooks/useColorScheme";

const ColorScheme = forwardRef<HTMLDivElement, Omit<SegmentProps, `items`>>((props, ref) => {

    const { colorScheme, setColorScheme } = useColorScheme()
    const items = useMemo(() => [
        { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
        { tag: `system`, index: 1, label: "", icon: SVGIcons.colorSchemeSystem },
        { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
    ], [])
    
    const selected = useMemo(() => [`light`,`system`,`dark`].indexOf(colorScheme), [colorScheme])
    
    return selected == -1 ? null : <Segmented 
        className={`--color-scheme`}
        onSwitch={({ tag }) => {
            setColorScheme(tag! as ColorScheme)
        }}
        selected={selected}
        items={items}
        {...props}
    />

})

export default ColorScheme