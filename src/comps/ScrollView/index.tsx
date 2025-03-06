import { forwardRef } from "react";
import { useBase, useScrollbar } from "../../hooks";
import Box from "../Box";
import { ScrollViewProps } from "./types";

const ScrollView = forwardRef<HTMLDivElement, ScrollViewProps>((props, ref) => {

    const { speed, style: _style, ...pops } = props
    const { rootRef, containerRef, thumbRef, handleDragStart } = useScrollbar()
    const { 
        style, 
        className, 
        rest 
    } = useBase<`div`>(pops)

    return <Box 
        ref={rootRef}
        className={className.trim()}
        as={`--scrollview rel`}>

        <Box as={`--scroll-content`} ref={containerRef} style={_style || {}}>
            {rest.children}
        </Box>

        <Box as={`--scroll-track abs`}>
            <Box as={`--scroll-thumb`} ref={thumbRef} onMouseDown={handleDragStart} />
        </Box>

    </Box>

})

ScrollView.displayName = `ScrollView`

export default ScrollView