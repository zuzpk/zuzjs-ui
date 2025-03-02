import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import Box from "../Box";
import { TRANSITIONS } from "../../types/enums";
export const Overlay = forwardRef((props, ref) => {
    const { when, ...pops } = props;
    return _jsx(Box, { ref: ref, "aria-hidden": !when, className: `--overlay fixed fill`, animate: {
            transition: TRANSITIONS.FadeIn,
            when,
        }, ...pops });
});
export default Overlay;
