import { forwardRef } from "react"
import { TRANSITIONS } from "../../types/enums"
import Box, { BoxProps } from "../Box"

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

Overlay.displayName = `Zuz.Overlay`

export default Overlay