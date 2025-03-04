"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import { useDelayed } from "../..";
import { useColorScheme } from "../../hooks/useColorScheme";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
const ColorScheme = forwardRef((props, ref) => {
    const mounted = useDelayed();
    const { colorScheme, setColorScheme } = useColorScheme();
    const items = useMemo(() => [
        { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
        { tag: `system`, index: 1, label: "", icon: SVGIcons.colorSchemeSystem },
        { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
    ], []);
    const selected = useMemo(() => [`light`, `system`, `dark`].indexOf(colorScheme), [colorScheme]);
    if (!mounted || selected == -1)
        return null;
    return _jsx(Segmented, { className: `--color-scheme`, onSwitch: ({ tag }) => {
            setColorScheme(tag);
        }, selected: selected, items: items, ...props });
});
ColorScheme.displayName = `ColorScheme`;
export default ColorScheme;
