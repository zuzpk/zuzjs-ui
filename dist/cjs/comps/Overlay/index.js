import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import { TRANSITIONS } from "../../types/enums";
import Box from "../Box";
export const Overlay = forwardRef((props, ref) => {
    const { when, ...pops } = props;
    return _jsx(Box, { ref: ref, "aria-hidden": !when, className: `--overlay fixed fill`, animate: {
            transition: TRANSITIONS.FadeIn,
            when,
        }, ...pops });
});
Overlay.displayName = `Overlay`;
export default Overlay;
