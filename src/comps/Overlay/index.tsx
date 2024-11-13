import { forwardRef } from "react"
import Box, { BoxProps } from "../Box"
import { TRANSITIONS } from "../../types/enums"

export type OverlayProps = BoxProps & {
    when?: boolean,
}

export const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {

    const { when, ...pops } = props

    return <Box 
        ref={ref}
        aria-hidden={!when}
        className={`--overlay fixed fill`}
        animate={{
            transition: TRANSITIONS.FadeIn,
            when,
        }}
        {...pops} />

})

export default Overlay