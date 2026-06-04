"use client"
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react"
import { useBase } from "../../hooks"
import { BoxProps } from "../../types"
import Box from "../Box"
import { ProgressBarProps, ProgressHandler } from "./types"

/**
 * ProgressBar component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ProgressBar value={65} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ProgressBar value={65} max={100} variant="success" animated label="65%" />
 * ```
 * @param value - Current value
 * @param max - max prop
 * @param variant - Visual variant or style
 * @param animated - animated prop
 * @param label - Label text for the component
 */
const ProgressBar = forwardRef<ProgressHandler, ProgressBarProps>((props, ref) => {

    const { progress, type, animated, ...pops } = props
    const bar = useRef<HTMLDivElement>(null)
    
    useImperativeHandle(ref, () => ({
        setProgress: (p: number) => {
            bar.current!.style.width = `${p * 100}%`
            bar.current!.setAttribute(`data-value`, p + "")
        },
        getProgress: () => {
            return +(bar.current!.getAttribute(`data-value`) || 0)
        }
    }), [])

    const mountedRef = useRef(false);

    useEffect(() => {
        if (!progress || !bar.current) return;
        const el = bar.current;

        if (animated && !mountedRef.current) {
            // Double-rAF: first frame paints initial 0% state (from CSS),
            // second frame triggers the CSS transition to the target value.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    el.style.width = `${progress * 100}%`;
                });
            });
        } else {
            el.style.width = `${progress * 100}%`;
        }

        mountedRef.current = true;
        el.setAttribute(`data-value`, String(progress));
    }, [progress, animated])

    const { className, style, rest } = useBase(pops)

    return <Box
        className={`--progress ${animated ? `--animated` : ``} flex rel ${className}`.trim()}
        style={style}
        {...rest as BoxProps}>
        <Box ref={bar} className={`--bar rel`} />
    </Box>

})

ProgressBar.displayName = `Zuz.ProgressBar`

export default ProgressBar