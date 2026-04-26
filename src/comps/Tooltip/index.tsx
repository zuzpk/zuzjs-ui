import { useAnchor } from "@zuzjs/hooks";
import { Ref, useImperativeHandle, useRef, useState } from "react";
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
    const master = useRef<HTMLDivElement>(null);
    const pos = useRef(6)
    const [ forcedVisible, setForcedVisible ] = useState(false)
    const { root: trigger, hovered, anchorName: _anchorName, canUseDocument } = useAnchor(children, anchorName);
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

    useImperativeHandle(ref, () => ({
        show: () => setForcedVisible(true),
        hide: () => setForcedVisible(false),
        setPosition: () => {} // CSS Anchors handle this automatically now!
    }));

    return <>
        {trigger}
        {canUseDocument
            ? createPortal(<Box    
                style={{
                    positionAnchor: _anchorName,
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