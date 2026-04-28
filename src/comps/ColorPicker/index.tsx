import { useAnchor } from "@zuzjs/hooks";
import { forwardRef, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Variant } from "../../types/enums";
import Box from "../Box";
import { layerManager } from "../layer_manager";
import Span from "../Span";
import { ColorPickerProps, ColorValue } from "./types";

type HSV = { h: number; s: number; v: number };
type RGB = { r: number; g: number; b: number };

function hsvToRgb({ h, s, v }: HSV): RGB {
    s /= 100; v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0, g = 0, b = 0;
    if      (h < 60)  { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else              { r = c; g = 0; b = x; }
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255),
    };
}

function rgbToHsv({ r, g, b }: RGB): HSV {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const d   = max - min;
    let h = 0;
    if (d !== 0) {
        if      (max === r) h = ((g - b) / d) % 6;
        else if (max === g) h = (b - r) / d + 2;
        else                h = (r - g) / d + 4;
        h = Math.round(h * 60);
        if (h < 0) h += 360;
    }
    return {
        h,
        s: max === 0 ? 0 : Math.round((d / max) * 100),
        v: Math.round(max * 100),
    };
}

function rgbToHex({ r, g, b }: RGB): string {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function hexToRgb(hex: string): RGB | null {
    const clean = hex.replace('#', '');
    const full  = clean.length === 3
        ? clean.split('').map(c => c + c).join('')
        : clean;
    if (full.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return {
        r: parseInt(full.substring(0, 2), 16),
        g: parseInt(full.substring(2, 4), 16),
        b: parseInt(full.substring(4, 6), 16),
    };
}

function buildColorValue(hsv: HSV, alpha: number): ColorValue {
    const rgb = hsvToRgb(hsv);
    return { hex: rgbToHex(rgb), rgb, hsv, alpha };
}

function clamp(val: number, min = 0, max = 100): number {
    return Math.max(min, Math.min(max, val));
}

const DEFAULT_HEX = '#3b82f6';

/**
 * ColorPicker component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ColorPicker onColorChange={(color) => console.log(color.hex)} />
 * ```
 *
 * @example
 * // With alpha and controlled value
 * ```tsx
 * <ColorPicker colorValue="#ff5733" alpha onColorChange={(c) => setColor(c)} />
 * ```
 *
 * @param colorValue   - Controlled hex color string
 * @param defaultValue - Initial hex color string (uncontrolled)
 * @param alpha        - Show alpha/opacity slider
 * @param format       - Display format in the trigger input: 'hex' | 'rgb'
 * @param onColorChange - Callback fired on every color change
 */
const ColorPicker = forwardRef<HTMLInputElement, ColorPickerProps>((props, _ref) => {
    const {
        defaultValue,
        colorValue,
        alpha: showAlpha = false,
        format = 'hex',
        onColorChange,
        variant,
        size,
        placeholder,
        kind,
        ...pops
    } = props;

    const { style, className, rest } = useBase<'input'>(pops);
    const { variant: themeVariant }  = useTheme(true)!;
    const isSquare = kind === 'square';
    const isExpanded = kind === 'expanded';

    // initial HSV
    const initHsv = useMemo<HSV>(() => {
        const hex = colorValue ?? defaultValue ?? DEFAULT_HEX;
        const rgb = hexToRgb(hex);
        return rgb ? rgbToHsv(rgb) : rgbToHsv(hexToRgb(DEFAULT_HEX)!);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // intentionally init-only

    const [choosing, setChoosing] = useState(false);
    const [hsv, setHsv]           = useState<HSV>(initHsv);
    const [alpha, setAlpha]       = useState(1);
    const [hexInput, setHexInput] = useState(() => rgbToHex(hsvToRgb(initHsv)));

    // sync controlled prop
    useEffect(() => {
        if (typeof colorValue !== 'undefined') {
            const rgb = hexToRgb(colorValue ?? '');
            if (rgb) {
                const next = rgbToHsv(rgb);
                setHsv(next);
                setHexInput(rgbToHex(rgb));
            }
        }
    }, [colorValue]);

    const _input      = useRef<HTMLInputElement>(null);
    const _pop        = useRef<HTMLDivElement>(null);
    const _areaRef    = useRef<HTMLDivElement>(null);
    const _hueRef     = useRef<HTMLDivElement>(null);
    const _alphaRef   = useRef<HTMLDivElement>(null);
    const draggingArea  = useRef(false);
    const draggingHue   = useRef(false);
    const draggingAlpha = useRef(false);

    const closePicker = useCallback(() => {
        setChoosing(false);
        _input.current?.focus();
    }, []);

    const pickFromArea = useCallback((e: MouseEvent | React.MouseEvent) => {
        const el = _areaRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const s = clamp(((e.clientX - rect.left) / rect.width) * 100);
        const v = clamp(100 - ((e.clientY - rect.top) / rect.height) * 100);
        setHsv(prev => {
            const next = { ...prev, s, v };
            const hex  = rgbToHex(hsvToRgb(next));
            setHexInput(hex);
            onColorChange?.(buildColorValue(next, alpha));
            return next;
        });
    }, [alpha, onColorChange]);

    const pickFromHue = useCallback((e: MouseEvent | React.MouseEvent) => {
        const el = _hueRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const h = clamp(((e.clientX - rect.left) / rect.width) * 360, 0, 360);
        setHsv(prev => {
            const next = { ...prev, h };
            const hex  = rgbToHex(hsvToRgb(next));
            setHexInput(hex);
            onColorChange?.(buildColorValue(next, alpha));
            return next;
        });
    }, [alpha, onColorChange]);

    const pickFromAlpha = useCallback((e: MouseEvent | React.MouseEvent) => {
        const el = _alphaRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const a = clamp(((e.clientX - rect.left) / rect.width) * 100) / 100;
        setAlpha(a);
        onColorChange?.(buildColorValue(hsv, a));
    }, [hsv, onColorChange]);

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            if      (draggingArea.current)  pickFromArea(e);
            else if (draggingHue.current)   pickFromHue(e);
            else if (draggingAlpha.current) pickFromAlpha(e);
        };
        const onUp = () => {
            draggingArea.current  = false;
            draggingHue.current   = false;
            draggingAlpha.current = false;
        };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        return () => {
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseup', onUp);
        };
    }, [pickFromArea, pickFromHue, pickFromAlpha]);

    useEffect(() => {
        if (isExpanded) return;
        if (choosing) {
            layerManager.push(closePicker);
        } else {
            layerManager.pop(closePicker);
        }

        return () => {
            layerManager.pop(closePicker);
        };
    }, [choosing, closePicker, isExpanded]);

    const currentRgb   = useMemo(() => hsvToRgb(hsv), [hsv]);
    const currentHex   = useMemo(() => rgbToHex(currentRgb), [currentRgb]);
    const hueRgb       = useMemo(() => hsvToRgb({ h: hsv.h, s: 100, v: 100 }), [hsv.h]);
    const hueColor     = `rgb(${hueRgb.r}, ${hueRgb.g}, ${hueRgb.b})`;
    const displayColor = showAlpha
        ? `rgba(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b}, ${alpha.toFixed(2)})`
        : `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`;
    const displayValue = format === 'rgb'
        ? `rgb(${currentRgb.r}, ${currentRgb.g}, ${currentRgb.b})`
        : currentHex;

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;

            if (draggingArea.current || draggingHue.current || draggingAlpha.current) {
                return;
            }

            if (!_input.current?.contains(target) && !_pop.current?.contains(target)) {
                setChoosing(false);
            }
        };

        if (!choosing || isExpanded) return;

        const timeout = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeout);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [choosing, isExpanded]);

    useEffect(() => {
        if (isExpanded) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && choosing && layerManager.isTop(closePicker)) {
                closePicker();
            }
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [choosing, closePicker, isExpanded]);

    const trigger = useMemo(() => {
        if (isSquare) return (
            <Box
                as={`--color-picker --color-picker-square --${variant || themeVariant || Variant.Small} ${className}`}
                onClick={() => setChoosing(prev => !prev)}
                style={style}>
                <Box
                    as={`--cp-swatch`}
                    style={{ backgroundColor: displayColor }}
                />
                <input
                    ref={_input}
                    readOnly
                    value={displayValue}
                    className={`--input ${variant ? `--${variant}` : ``} flex`.trim()}
                    style={style}
                    onFocus={() => setChoosing(true)}
                    placeholder={placeholder ?? DEFAULT_HEX}
                    {...rest}
                    type="hidden"
                    autoComplete="off"
                />
            </Box>
        );
        return (
            <Box
                as={`--color-picker --${variant || themeVariant || Variant.Small} rel flex aic ${className}`}>
                <Span
                    as={`--cp-swatch`}
                    style={{ backgroundColor: displayColor }}
                />
                <input
                    ref={_input}
                    readOnly
                    value={displayValue}
                    className={`--input ${variant ? `--${variant}` : ``} flex`.trim()}
                    style={style}
                    onFocus={() => setChoosing(true)}
                    placeholder={placeholder ?? DEFAULT_HEX}
                    {...rest}
                    autoComplete="off"
                />
            </Box>
        );
    }, [isSquare, className, displayColor, displayValue, placeholder, rest, style, themeVariant, variant]);

    const { root, canUseDocument, floatingRef, floatingStyle } = useAnchor(isExpanded ? null : trigger, '--color-picker-anchor', {
        open: isExpanded ? false : choosing,
        autoFlip: true,
        preferredPlacement: 'bottom',
        margin: 10,
    });

    const chooser = (
        <Box
            aria-hidden={isExpanded ? false : !choosing}
            ref={(node: HTMLDivElement) => {
                _pop.current = node;
                if (!isExpanded) floatingRef.current = node;
            }}
            style={isExpanded ? {} : { ...floatingStyle, zIndex: `var(--max-z-index)` }}
            fx={isExpanded ? undefined : {
                from:     { y: 5, opacity: 0 },
                to:       { y: 0, opacity: 1 },
                when:     choosing,
                duration: .05,
            }}
            as={`--color-picker-chooser${isExpanded ? ' --color-picker-expanded' : ' abs'}`}>

            {/* saturation / brightness area */}
            <div
                ref={_areaRef}
                className={`--cp-area`}
                style={{ backgroundColor: hueColor }}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    draggingArea.current = true;
                    pickFromArea(e);
                }}>
                <div className={`--cp-area-gradient-s`} />
                <div className={`--cp-area-gradient-v`} />
                <div
                    className={`--cp-cursor`}
                    style={{
                        left:            `${hsv.s}%`,
                        top:             `${100 - hsv.v}%`,
                        backgroundColor: currentHex,
                    }}
                />
            </div>

            {/* hue slider */}
            <div
                ref={_hueRef}
                className={`--cp-slider --cp-hue`}
                onMouseDown={(e) => {
                    e.stopPropagation();
                    draggingHue.current = true;
                    pickFromHue(e);
                }}>
                <div
                    className={`--cp-thumb`}
                    style={{
                        left:            `${(hsv.h / 360) * 100}%`,
                        backgroundColor: hueColor,
                    }}
                />
            </div>

            {/* alpha slider */}
            {showAlpha && (
                <div
                    ref={_alphaRef}
                    className={`--cp-slider --cp-alpha`}
                    style={{
                        background: `linear-gradient(to right, transparent, ${currentHex})`,
                    }}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        draggingAlpha.current = true;
                        pickFromAlpha(e);
                    }}>
                    <div
                        className={`--cp-thumb`}
                        style={{ left: `${alpha * 100}%` }}
                    />
                </div>
            )}

            {/* preview + hex input */}
            <div className={`--cp-inputs`}>
                <div className={`--cp-preview`} style={{ backgroundColor: displayColor }} />
                <input
                    className={`--cp-hex-input`}
                    value={hexInput}
                    spellCheck={false}
                    onChange={(e) => {
                        const val = e.currentTarget.value;
                        setHexInput(val);
                        const rgb = hexToRgb(val);
                        if (rgb) {
                            const next = rgbToHsv(rgb);
                            setHsv(next);
                            onColorChange?.(buildColorValue(next, alpha));
                        }
                    }}
                />
            </div>
        </Box>
    );

    if (isExpanded) return chooser;
    return <>
        {root}
        {canUseDocument ? createPortal(chooser, document.body) : null}
    </>;
});

ColorPicker.displayName = `Zuz.ColorPicker`;

export default ColorPicker;
