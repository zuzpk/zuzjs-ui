"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from 'react';
import { useBase } from '../../hooks';
import Box from '../Box';
import Button from '../Button';
import Input from '../Input';
import SVGIcons from '../svgicons';
const Password = forwardRef((props, ref) => {
    const { ...pops } = props;
    if (`type` in pops) {
        delete pops[`type`];
    }
    const { style, className, rest } = useBase(pops);
    const [visible, setVisible] = useState(false);
    return _jsxs(Box, { style: style, className: `--password flex aic rel`, children: [_jsx(Input, { ref: ref, type: visible ? 'text' : 'password', className: className, ...rest }), _jsx(Button, { tabIndex: -1, onClick: () => setVisible(prev => !prev), className: `--toggle flex aic jcc abs`, children: visible ? SVGIcons.eye : SVGIcons.eyeSlash })] });
});
Password.displayName = `Password`;
export default Password;
