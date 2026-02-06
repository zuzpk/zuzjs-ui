import { forwardRef } from "react";
import { Variant } from "../../types/enums";
import Button from "../Button";
import SVGIcons from "../svgicons";
import { FabProps } from "./types";

const Fab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {

    const { icon, variant, position } = props

    return <Button className={`--fab fixed --${variant || Variant.Large} --${position || `bottomright`}`}>
        {icon || SVGIcons.plus}
    </Button>

})

Fab.displayName = `Zuz.Fab`

export default Fab