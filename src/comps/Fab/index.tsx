import { forwardRef } from "react";
import { FabProps } from "./types";
import Button from "../Button";
import Icon from "../Icon";
import SVGIcons from "../svgicons";
import { Position, Size } from "../../types/enums";

const Fab = forwardRef<HTMLButtonElement, FabProps>((props, ref) => {

    const { icon, size, position } = props

    return <Button className={`--fab fixed --${size || Size.Large} --${position || `bottomright`}`}>
        {icon || SVGIcons.plus}
    </Button>

})

export default Fab