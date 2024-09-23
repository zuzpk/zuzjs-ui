import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
const Image = forwardRef((props, ref) => {
    const { as, width, height, ...rest } = props;
    return _jsx(With, { tag: `img`, as: as, ...rest, ref: ref });
});
export default Image;
