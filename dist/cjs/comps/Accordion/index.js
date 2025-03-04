"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from "react";
import Box from "../Box";
import Button from "../Button";
import Text from "../Text";
import SVGIcons from "../svgicons";
const Accordion = forwardRef((props, ref) => {
    const { title, message, ...rest } = props;
    const [visible, setVisible] = useState(false);
    return _jsxs(Box, { className: `--accordion flex cols`, ...rest, children: [_jsxs(Button, { onClick: (e) => setVisible(!visible), className: `--toggle flex aic ${visible ? `--open` : ``}`.trim(), children: [_jsx(Text, { className: `--label flex`, children: title }), _jsx(Box, { className: `--arrow flex`, children: visible ? SVGIcons.arrowUp : SVGIcons.arrowDown })] }), visible && _jsx(Box, { className: `--detail`, children: message })] });
});
Accordion.displayName = `Accordion`;
export default Accordion;
