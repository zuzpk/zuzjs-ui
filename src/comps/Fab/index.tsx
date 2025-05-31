import { forwardRef } from "react";
import { Size } from "../../types/enums";
import Button from "../Button";
import SVGIcons from "../svgicons";
import { FabProps } from "./types";

const Fab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {

    const { icon, size, position } = props

    return <Button className={`--fab fixed --${size || Size.Large} --${position || `bottomright`}`}>
        {icon || SVGIcons.plus}
    </Button>

})

Fab.displayName = `Zuz.Fab`

export default Fab