import { useScrollbar } from "@zuzjs/hooks";
import { forwardRef, useEffect } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import { ScrollViewProps } from "./types";

/**
 * ScrollView component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ScrollView><div>Scrollable content here</div></ScrollView>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <ScrollView direction="vertical" scrollbar="auto" onScroll={(pos) => console.log(pos)}>Long content</ScrollView>
 * ```
 * @param direction - direction prop
 * @param scrollbar - scrollbar prop
 * @param onScroll - Callback function triggered on scroll
 */
const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>((props, ref) => {

    const { 
        speed, 
        smooth = false, 
        breakpoints = {},
        style: _style, ...pops } = props
    const { 
        rootRef, containerRef, thumbY, thumbX, onScrollY, onScrollX 
    } = useScrollbar(speed || 1, breakpoints, smooth)
    const { 
        style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const sync = () => {
            // Trigger a global reposition event for Selects/Tooltips
            window.dispatchEvent(new Event('resize')); 
        };

        const handleWheel = (e: WheelEvent) => {
            const target = e.target as HTMLElement;
            // Check if the user is scrolling inside a Select list or another scrollable child
            const isInsideScrollableChild = target.closest('.--allow-scroll');

            if (isInsideScrollableChild) {
                const scrollable = target.closest('.--allow-scroll') as HTMLElement;
                const { scrollTop, scrollHeight, clientHeight } = scrollable;
                
                const isScrollingUp = e.deltaY < 0;
                const isScrollingDown = e.deltaY > 0;

                // If the child can still scroll, stop ScrollView from reacting
                if ((isScrollingUp && scrollTop > 0) || 
                    (isScrollingDown && scrollTop + clientHeight < scrollHeight)) {
                    e.stopPropagation();
                }
            }
        };

        el.addEventListener('scroll', sync);
        el.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            el.removeEventListener('scroll', sync);
            el.removeEventListener('wheel', handleWheel);
        };

    }, [containerRef]);

    return <Box 
        ref={rootRef}
        className={className.trim()}
        as={`--scrollview rel`}>

        <Box as={`--scroll-content ${className}`.trim()} ref={containerRef} style={_style || {}}>
            {rest.children}
        </Box>

        <Box as={`--scroll-track --track-y --abs`}>
            <Box as={`--scroll-thumb --abs --round`} ref={thumbY} onMouseDown={onScrollY} />
        </Box>
        <Box as={`--scroll-track --track-x --abs`}>
            <Box as={`--scroll-thumb --abs --round`} ref={thumbX} onMouseDown={onScrollX} />
        </Box>

    </Box>

})

ScrollView.displayName = `Zuz.ScrollView`

export default ScrollView