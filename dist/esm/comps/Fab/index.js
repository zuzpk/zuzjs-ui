import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { Size } from "../../types/enums";
import Button from "../Button";
import SVGIcons from "../svgicons";
const Fab = forwardRef((props, ref) => {
    const { icon, size, position } = props;
    return _jsx(Button, { className: `--fab fixed --${size || Size.Large} --${position || `bottomright`}`, children: icon || SVGIcons.plus });
});
Fab.displayName = `Fab`;
export default Fab;
