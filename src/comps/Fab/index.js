import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import Button from "../Button";
import SVGIcons from "../svgicons";
import { Size } from "../../types/enums";
const Fab = forwardRef((props, ref) => {
    const { icon, size, position } = props;
    return _jsx(Button, { className: `--fab fixed --${size || Size.Large} --${position || `bottomright`}`, children: icon || SVGIcons.plus });
});
export default Fab;
