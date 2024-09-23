import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
import Spinner from "./spinner";
import { hexToRgba } from "../funs";
const Cover = forwardRef((props, ref) => {
    const { spinner, message, color, as, ...rest } = props;
    return (_jsxs(With, { className: `zuz-cover flex aic jcc cols abs fill`, ref: ref, style: {
            backgroundColor: color ? !color.startsWith(`#`) ? hexToRgba(color, .9) : color : hexToRgba(color || `#ffffff`, .9)
        }, as: as, ...rest, children: [_jsx(Spinner, { ...spinner }), _jsx(With, { tag: `h1`, className: `label`, children: message || `loading` })] }));
});
export default Cover;
