import { forwardRef } from "react";
import { useBase, useScrollbar } from "../../hooks";
import Box from "../Box";
import { ScrollViewProps } from "./types";

const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>((props, ref) => {

    const { speed, style: _style, ...pops } = props
    const { rootRef, containerRef, thumbY, thumbX, onScrollY, onScrollX } = useScrollbar()
    const { 
        style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    // useEffect(() => { }, [])

    return <Box 
        ref={rootRef}
        className={className.trim()}
        as={`--scrollview rel`}>

        <Box as={`--scroll-content`} ref={containerRef} style={_style || {}}>
            {rest.children}
        </Box>

        <Box as={`--scroll-track --track-y abs`}>
            <Box as={`--scroll-thumb abs`} ref={thumbY} onMouseDown={onScrollY} />
        </Box>
        <Box as={`--scroll-track --track-x abs`}>
            <Box as={`--scroll-thumb abs`} ref={thumbX} onMouseDown={onScrollX} />
        </Box>

    </Box>

})

ScrollView.displayName = `Zuz.ScrollView`

export default ScrollView