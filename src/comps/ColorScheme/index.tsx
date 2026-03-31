"use client"
import { useDelayed } from "@zuzjs/hooks";
import { forwardRef, useCallback, useMemo } from "react";
import useBase from "../../hooks/useBase";
import { useColorScheme, useTheme } from "../../hooks/useColorScheme";
import { ValueOf } from "../../types";
import { COLORTHEME } from "../../types/enums";
import Button from "../Button";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
import { ColorSchemeProps } from "./types";

const ColorScheme = forwardRef<HTMLDivElement, ColorSchemeProps>((props, ref) => {

    const { type, variant, ...pops } = props
    const mounted = useDelayed()
    const { 
        colorScheme, 
        setColorScheme 
    } = useColorScheme()!
    
    const loopSchemes = useCallback(() => {
        setColorScheme(
            colorScheme == `dark` ? `light`
            : colorScheme == `light` ? `system`
            : `dark`            
        )
    }, [colorScheme])

    const { variant: themeVariant } = useTheme(true)!

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
            setColorScheme(tag! as ValueOf<typeof COLORTHEME>)
        }}
        selected={selected}
        items={items}
        {...pops}
    /> : <Button 
        onClick={loopSchemes}
        style={style}
        variant={variant}
        as={`--color-scheme-switch ${className}`.trim()}>{
        colorScheme == `system` ? SVGIcons.colorSchemeSystem
        : colorScheme == `light` ? SVGIcons.colorSchemeLight 
        : SVGIcons.colorSchemeDark
    }</Button>

})

ColorScheme.displayName = `Zuz.ColorScheme`

export default ColorScheme