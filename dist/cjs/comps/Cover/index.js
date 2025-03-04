"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { SPINNER } from "../../types/enums";
import Box from "../Box";
import Spinner from "../Spinner";
import Text from "../Text";
const Cover = forwardRef((props, ref) => {
    const { message, spinner, color, when, hideMessage, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    if (`when` in props && props.when == false) {
        return null;
    }
    return _jsxs(Box, { className: `--cover flex aic jcc cols abs fillx nope nous`, style: {
            ...style,
            backgroundColor: `var(--cover-bg)`
        }, ...rest, children: [_jsx(Spinner, { type: spinner || SPINNER.Simple }), !hideMessage && _jsx(Text, { className: `--label`, style: { color: `var(--cover-label)` }, children: message || `loading` })] });
});
Cover.displayName = `Cover`;
export default Cover;
