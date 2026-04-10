import { addPropsToChildren } from "@zuzjs/core/react";
import { Ref, useId, useImperativeHandle, useMemo, useRef, useState } from "react";
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
    const [ hovered, setHovered ] = useState(false)
    const pos = useRef(6)
    const isVisible = show === true || hovered;

    const anchorId = useId().replace(/:/g, ""); 
    const _anchorName = `--anchor-${anchorId}`;

    const { tooltip: themeTooltip } = useTheme(true)!

    const trigger = useMemo(() => {
        
        let foundAnchor = false;

        // Pass 1: Look for .--tooltip-anchor recursively
        return addPropsToChildren(
            children,
            (element) => {
                // CONDITION: We only want to modify the Root (first element) 
                // OR the element that explicitly has the anchor class.
                // const isRoot = !foundAnchor; // This will stay true for the very first node
                // const isAnchor = element.props.className?.includes(anchorName);
                
                // // We set foundAnchor to true once we hit the target 
                // // so we don't accidentally treat deeper nodes as "root"
                // if (isAnchor) foundAnchor = true; 
                
                // return isRoot || isAnchor;
                const isMatch = element.props.className?.includes(anchorName);
                if (isMatch) foundAnchor = true;
                return isMatch || !foundAnchor; // If we haven't found any anchor yet, keep looking. Once we find one, stop adding props to others.
            },
            (index, element) => {
                const isAnchor = element.props.className?.includes(anchorName);
                const isRoot = index === 0;

                const props: any = {};

                // 1. If it's the anchor (Knob), give it the CSS ID
                if (isAnchor || isRoot) {
                    props.style = { ...element.props.style, anchorName: _anchorName };
                }

                // 2. If it's the root (the whole Slider), give it the Hover listeners
                // This ensures hovering ANYWHERE on the slider shows the tooltip
                if (isRoot) {
                    props.onMouseEnter = (e: any) => {
                        setHovered(true);
                        element.props.onMouseEnter?.(e);
                    };
                    props.onMouseLeave = (e: any) => {
                        setHovered(false);
                        element.props.onMouseLeave?.(e);
                    };
                }

                return props;
            }
        );
    }, [children, anchorName, _anchorName]);

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
        show: () => setHovered(true),
        hide: () => setHovered(false),
        setPosition: () => {} // CSS Anchors handle this automatically now!
    }));

    return <>
        {trigger}
        {createPortal(<Box    
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
        , document.body)}
    </>

};

ToolTip.displayName = `Zuz.ToolTip`;

export default ToolTip;