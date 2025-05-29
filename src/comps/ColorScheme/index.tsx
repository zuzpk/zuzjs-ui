"use client"
import { forwardRef, useCallback, useMemo } from "react";
import { Button, useBase, useDelayed, Variant } from "../..";
import { ColorScheme, useColorScheme } from "../../hooks/useColorScheme";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
import { ColorSchemeProps } from "./types";

const ColorScheme = forwardRef<HTMLDivElement, ColorSchemeProps>((props, ref) => {

    const { type, ...pops } = props
    const mounted = useDelayed()
    const { colorScheme, setColorScheme } = useColorScheme()
    
    const loopSchemes = useCallback(() => {
        setColorScheme(
            colorScheme == `dark` ? `light`
            : colorScheme == `light` ? `system`
            : `dark`            
        )
    }, [colorScheme])

    const { className, style } = useBase(pops)

    const items = useMemo(() => type == `system` ? 
        [
            { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
            { tag: `system`, index: 1, label: "", icon: SVGIcons.colorSchemeSystem },
            { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
        ]
        : 
        [
            { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
            { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
        ], [])
    
    const selected = useMemo(() => [`light`,`system`,`dark`].indexOf(colorScheme), [colorScheme])
    
    if ( !mounted || selected == -1 ) return null;

    return type == `system` || type == `switch` ? <Segmented 
        className={`--color-scheme --${type}`}
        onSwitch={({ tag }) => {
            setColorScheme(tag! as ColorScheme)
        }}
        selected={selected}
        items={items}
        {...pops}
    /> : <Button 
        onClick={loopSchemes}
        style={style}
        as={`--color-scheme-switch --${pops.variant || Variant.Small} ${className}`.trim()}>{
        colorScheme == `system` ? SVGIcons.colorSchemeSystem
        : colorScheme == `light` ? SVGIcons.colorSchemeLight 
        : SVGIcons.colorSchemeDark
    }</Button>

})

ColorScheme.displayName = `Zuz.ColorScheme`

export default ColorScheme