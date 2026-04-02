import { forwardRef } from "react"
import { TRANSITIONS } from "../../types/enums"
import Box from "../Box"
import { BoxProps } from "../../types"

export type OverlayProps = BoxProps & {
    when?: boolean,
}

/**
 * Overlay component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Overlay onClick={() => console.log("clicked")} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Overlay visible={true} zIndex={100} opacity={0.5} onClick={() => {}} />
 * ```
 * @param visible - Whether element is visible
 * @param zIndex - Z-index stacking order
 * @param opacity - Opacity level (0-1)
 * @param onClick - Callback function triggered on click
 */
export const Overlay = forwardRef<HTMLDivElement, OverlayProps>((props, ref) => {

    const { when, ...pops } = props

    return <Box 
        ref={ref}
        aria-hidden={!when}
        className={`--overlay fixed fill`}
        fx={{
            transition: TRANSITIONS.FadeIn,
            when,
        }}
        {...pops} />

})

Overlay.displayName = `Zuz.Overlay`

export default Overlay