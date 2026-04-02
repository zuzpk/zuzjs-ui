import { forwardRef } from "react";
import { Variant } from "../../types/enums";
import Button from "../Button";
import SVGIcons from "../svgicons";
import { FabProps } from "./types";

/**
 * Fab component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Fab icon="plus" onClick={() => console.log("clicked")} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Fab icon="plus" onClick={() => console.log("clicked")} variant="primary" size="lg" />
 * ```
 * @param icon - Icon identifier
 * @param onClick - Callback function triggered on click
 * @param variant - Visual variant or style
 * @param size - Component size
 */
const Fab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {

    const { icon, variant, position } = props

    return <Button className={`--fab fixed --${variant || Variant.Large} --${position || `bottomright`}`}>
        {icon || SVGIcons.plus}
    </Button>

})

Fab.displayName = `Zuz.Fab`

export default Fab