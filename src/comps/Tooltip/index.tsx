import { useAnchor } from "@zuzjs/hooks";
import { Ref, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useBase, useFx } from "../../hooks";
import { useTheme } from "../../hooks/useColorScheme";
import { Position, TRANSITION_CURVES, TRANSITIONS, Variant } from "../../types";
import Box from "../Box";
import Text from "../Text";
import { ToolTipController, ToolTipProps } from "./types";

/**
 * Tooltip component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Tooltip content="Helpful text">Hover me</Tooltip>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Tooltip content="Full description here" position="top" delay={200} variant="dark">Information icon</Tooltip>
 * ```
 * @param content - Content text or element
 * @param position - position prop
 * @param delay - delay prop
 * @param variant - Visual variant or style
 */
const ToolTip = ({
    ref,
    ...props
} : ToolTipProps & {
    ref?: Ref<ToolTipController>
}) => {

    const { title, position, 
        margin = 4, 
        anchorName = '--tooltip-anchor',
        children, show, variant, ...pops } = props;
    const { style, className, rest } = useBase(pops);
    const dx = position || Position.Top;
    const tooltipRef = useRef<HTMLDivElement>(null);
    const [ forcedVisible, setForcedVisible ] = useState(false)
    const [fallbackStyle, setFallbackStyle] = useState<{ top: number; left: number; position: "fixed" } | null>(null);
    const supportsCssAnchor = useMemo(() => {
        if (typeof window === "undefined" || typeof CSS === "undefined" || typeof CSS.supports !== "function") {
            return false;
        }
        return CSS.supports("position-anchor: --zuz-anchor") && CSS.supports("top: anchor(top)");
    }, []);

    const { root: trigger, hovered, anchorName: _anchorName, canUseDocument, anchorRef } = useAnchor(children, anchorName);
    const isVisible = show === true || forcedVisible || hovered;

    const { tooltip: themeTooltip } = useTheme(true)!

    const tooltipAnimation = useFx({
        transition: dx == Position.Top ? TRANSITIONS.SlideInTop :
            dx == Position.Bottom ? TRANSITIONS.SlideInBottom
                : dx == Position.Left ? TRANSITIONS.SlideInLeft
                    : TRANSITIONS.SlideInRight,
        when: isVisible,
        duration: 0.2,
        offset: margin + 6,
        margin: dx == Position.Top || dx == Position.Left ? -margin : margin,
        curve: themeTooltip?.curve || TRANSITION_CURVES.EaseInOut,
    });

    useLayoutEffect(() => {
        if (!isVisible || !canUseDocument || supportsCssAnchor) {
            return;
        }

        const anchorEl = anchorRef?.current;
        const tipEl = tooltipRef.current;
        if (!anchorEl || !tipEl) {
            return;
        }

        const anchorRect = anchorEl.getBoundingClientRect();
        const tipRect = tipEl.getBoundingClientRect();
        const viewportPadding = 8;
        const gap = margin + 6;

        let top = 0;
        let left = 0;

        if (dx === Position.Top) {
            top = anchorRect.top - tipRect.height - gap;
            left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
        } else if (dx === Position.Bottom) {
            top = anchorRect.bottom + gap;
            left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
        } else if (dx === Position.Left) {
            top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
            left = anchorRect.left - tipRect.width - gap;
        } else {
            top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
            left = anchorRect.right + gap;
        }

        // Flip on overflow for better fallback behavior.
        if (dx === Position.Top && top < viewportPadding) {
            top = anchorRect.bottom + gap;
        } else if (dx === Position.Bottom && top + tipRect.height > window.innerHeight - viewportPadding) {
            top = anchorRect.top - tipRect.height - gap;
        } else if (dx === Position.Left && left < viewportPadding) {
            left = anchorRect.right + gap;
        } else if (dx === Position.Right && left + tipRect.width > window.innerWidth - viewportPadding) {
            left = anchorRect.left - tipRect.width - gap;
        }

        top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tipRect.height - viewportPadding));
        left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tipRect.width - viewportPadding));

        setFallbackStyle({ top, left, position: "fixed" });
    }, [anchorRef, canUseDocument, dx, isVisible, margin, supportsCssAnchor]);

    useEffect(() => {
        if (!isVisible || supportsCssAnchor || !canUseDocument) {
            return;
        }

        const update = () => {
            const anchorEl = anchorRef?.current;
            const tipEl = tooltipRef.current;
            if (!anchorEl || !tipEl) return;

            const anchorRect = anchorEl.getBoundingClientRect();
            const tipRect = tipEl.getBoundingClientRect();
            const viewportPadding = 8;
            const gap = margin + 6;

            let top = 0;
            let left = 0;

            if (dx === Position.Top) {
                top = anchorRect.top - tipRect.height - gap;
                left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
            } else if (dx === Position.Bottom) {
                top = anchorRect.bottom + gap;
                left = anchorRect.left + anchorRect.width / 2 - tipRect.width / 2;
            } else if (dx === Position.Left) {
                top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
                left = anchorRect.left - tipRect.width - gap;
            } else {
                top = anchorRect.top + anchorRect.height / 2 - tipRect.height / 2;
                left = anchorRect.right + gap;
            }

            if (dx === Position.Top && top < viewportPadding) {
                top = anchorRect.bottom + gap;
            } else if (dx === Position.Bottom && top + tipRect.height > window.innerHeight - viewportPadding) {
                top = anchorRect.top - tipRect.height - gap;
            } else if (dx === Position.Left && left < viewportPadding) {
                left = anchorRect.right + gap;
            } else if (dx === Position.Right && left + tipRect.width > window.innerWidth - viewportPadding) {
                left = anchorRect.left - tipRect.width - gap;
            }

            top = Math.max(viewportPadding, Math.min(top, window.innerHeight - tipRect.height - viewportPadding));
            left = Math.max(viewportPadding, Math.min(left, window.innerWidth - tipRect.width - viewportPadding));

            setFallbackStyle({ top, left, position: "fixed" });
        };

        update();
        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);

        return () => {
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [anchorRef, canUseDocument, dx, isVisible, margin, supportsCssAnchor]);

    useImperativeHandle(ref, () => ({
        show: () => setForcedVisible(true),
        hide: () => setForcedVisible(false),
        setPosition: () => {} // CSS Anchors handle this automatically now!
    }));

    return <>
        {trigger}
        {canUseDocument
            ? createPortal(<Box    
                ref={tooltipRef as Ref<HTMLDivElement>}
                style={{
                    ...(supportsCssAnchor ? { positionAnchor: _anchorName } : (fallbackStyle || {})),
                    ...tooltipAnimation.style,
                    ...(
                        dx === Position.Top || dx === Position.Bottom  ? 
                            { "--fx-x": "-50%" } : { "--fx-y": "-50%" }
                    )
                }}
                as={`--tooltip --visb-${isVisible} --${variant || themeTooltip?.variant || Variant.Small} --${dx} abs ${className}`.trim()}>
                {typeof title === 'string' ? <Text as={`--text rel`}>{title}</Text> : title}
            </Box>
            , document.body)
            : null}
    </>

};

ToolTip.displayName = `Zuz.ToolTip`;

export default ToolTip;