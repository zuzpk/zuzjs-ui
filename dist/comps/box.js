import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Box = forwardRef((props, ref) => {
    const { as, ...rest } = props;
    return _jsx(With, { as: as, ...rest, ref: ref });
});
export default Box;
