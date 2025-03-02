"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useMemo } from "react";
import Segmented from "../Segmented";
import SVGIcons from "../svgicons";
import { useColorScheme } from "../../hooks/useColorScheme";
const ColorScheme = forwardRef((props, ref) => {
    const { colorScheme, setColorScheme } = useColorScheme();
    const items = useMemo(() => [
        { tag: `light`, index: 0, label: "", icon: SVGIcons.colorSchemeLight },
        { tag: `system`, index: 1, label: "", icon: SVGIcons.colorSchemeSystem },
        { tag: `dark`, index: 2, label: "", icon: SVGIcons.colorSchemeDark },
    ], []);
    const selected = useMemo(() => [`light`, `system`, `dark`].indexOf(colorScheme), [colorScheme]);
    return selected == -1 ? null : _jsx(Segmented, { className: `--color-scheme`, onSwitch: ({ tag }) => {
            setColorScheme(tag);
        }, selected: selected, items: items, ...props });
});
export default ColorScheme;
