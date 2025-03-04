import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { ALERT } from "../../types/enums";
import Box from "../Box";
import SVGIcons from "../svgicons";
import Text from "../Text";
const Alert = forwardRef((props, ref) => {
    const { type, icon, title, message, iconSize, ...pops } = props;
    const { className, style, rest } = useBase(pops);
    return _jsxs(Box, { className: `--alert --${(type || ALERT.Info)} flex aic ${className}`.trim(), style: style, ...rest, children: [_jsx(Box, { className: `--icon icon-${icon || `auto-matic`}`, style: iconSize ? { width: iconSize, height: iconSize } : {}, children: !icon && SVGIcons[type || ALERT.Info] }), _jsxs(Box, { className: `--meta flex cols`, children: [_jsx(Text, { className: `--title ${message ? `--tm` : ``}`, children: title || `Lorem ipsum dolor sit amet, consectetur adipiscing elit.` }), message && _jsx(Text, { className: `--message`, h: 2, children: message })] })] });
});
Alert.displayName = `Alert`;
export default Alert;
