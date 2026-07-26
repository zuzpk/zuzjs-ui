import { useScrollbar } from "@zuzjs/hooks";
import { forwardRef, UIEvent, useEffect } from "react";
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
        direction = 'both',
        onScroll,
        autoScrollToBottom = false,
        style: _style, ...pops } = props
    const { 
        rootRef, containerRef, thumbY, thumbX, onScrollY, onScrollX 
    } = useScrollbar(speed || 1, breakpoints, smooth)
    const { 
        style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    const scrollStyle = {
        ..._style,
        ...(direction === 'vertical' ? { overflowX: 'hidden' as const } : {}),
        ...(direction === 'horizontal' ? { overflowY: 'hidden' as const } : {}),
    }

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const sync = () => {
            // Trigger a global reposition event for Selects/Tooltips
            window.dispatchEvent(new Event('resize')); 
        };

        const forwardScroll = (event: Event) => {
            onScroll?.(event as unknown as UIEvent<HTMLDivElement>);
        };

        const handleWheel = (e: WheelEvent) => {
            const target = e.target;
            if (!(target instanceof Element)) return;

            // Check if the user is scrolling inside a Select list or another scrollable child.
            const scrollable = target.closest('.--allow-scroll') as HTMLElement | null;
            if (!scrollable) return;

            const { scrollTop, scrollHeight, clientHeight } = scrollable;
            const isScrollingUp = e.deltaY < 0;
            const isScrollingDown = e.deltaY > 0;

            // If the child can still scroll, stop ScrollView from reacting.
            if ((isScrollingUp && scrollTop > 0) ||
                (isScrollingDown && scrollTop + clientHeight < scrollHeight)) {
                e.stopPropagation();
            }
        };

        el.addEventListener('scroll', sync);
        el.addEventListener('scroll', forwardScroll);
        el.addEventListener('wheel', handleWheel, { passive: true });

        return () => {
            el.removeEventListener('scroll', sync);
            el.removeEventListener('scroll', forwardScroll);
            el.removeEventListener('wheel', handleWheel);
        };

    }, [containerRef, onScroll]);

    // Auto-scroll to bottom when content changes
    useEffect(() => {
        if (!autoScrollToBottom) return;
        
        const el = containerRef.current;
        if (!el) return;

        const scrollToBottom = () => {
            const scrollOptions: ScrollToOptions = {
                top: el.scrollHeight,
                left: 0,
            };
            
            if (autoScrollToBottom === 'smooth') {
                scrollOptions.behavior = 'smooth';
            }
            
            el.scrollTo(scrollOptions);
        };

        // Scroll on mount and when children change
        scrollToBottom();
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoScrollToBottom, rest.children]);

    return <Box 
        ref={rootRef}
        className={`${className.trim()} --direction-${direction}`.trim()}
        as={`--scrollview rel`}>

        {/*
          Structure:
          - .--scroll-content  = scrollport (overflow + measurements)
          - .--scroll-inner    = in-flow sizing box + containing block for abs children
            so abs/fixed descendants scroll with content but do NOT inflate
            scrollWidth/scrollHeight used by the scrollbar.
        */}
        <Box as={`--scroll-content ${className}`.trim()} ref={containerRef} style={scrollStyle}>
            <Box as={`--scroll-inner rel`}>
                {rest.children}
            </Box>
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