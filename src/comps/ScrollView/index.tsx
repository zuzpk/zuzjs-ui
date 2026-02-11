import { forwardRef, useEffect } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import { ScrollViewProps } from "./types";
import { useScrollbar } from "@zuzjs/hooks";

const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>((props, ref) => {

    const { speed, style: _style, ...pops } = props
    const { rootRef, containerRef, thumbY, thumbX, onScrollY, onScrollX } = useScrollbar(speed || 1)
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

        el.addEventListener('scroll', sync);
        return () => el.removeEventListener('scroll', sync);
    }, []);

    return <Box 
        ref={rootRef}
        className={className.trim()}
        as={`--scrollview rel`}>

        <Box as={`--scroll-content ${className}`.trim()} ref={containerRef} style={_style || {}}>
            {rest.children}
        </Box>

        <Box as={`--scroll-track --track-y --abs`}>
            <Box as={`--scroll-thumb --abs`} ref={thumbY} onMouseDown={onScrollY} />
        </Box>
        <Box as={`--scroll-track --track-x --abs`}>
            <Box as={`--scroll-thumb --abs`} ref={thumbX} onMouseDown={onScrollX} />
        </Box>

    </Box>

})

ScrollView.displayName = `Zuz.ScrollView`

export default ScrollView