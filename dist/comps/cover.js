import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import With from "./base";
import Spinner from "./spinner";
const Cover = forwardRef((props, ref) => {
    const { spinner, message, color, as, when, ...rest } = props;
    if (`when` in props && props.when == false) {
        return null;
    }
    return (_jsxs(With, { className: `zuz-cover flex aic jcc cols abs fillx nope nous`, ref: ref, style: {
            backgroundColor: `var(--cover-bg)`
        }, as: as, ...rest, children: [_jsx(Spinner, { ...{
                    ...spinner
                } }), _jsx(With, { tag: `h1`, className: `label`, style: { color: `var(--cover-label)` }, children: message || `loading` })] }));
});
export default Cover;
