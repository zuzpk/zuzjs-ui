"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useState } from 'react';
import { useBase } from '../../hooks';
import Input from '../Input';
import Box from '../Box';
import Button from '../Button';
import SVGIcons from '../svgicons';
const OTP = forwardRef((props, ref) => {
    const { ...pops } = props;
    if (`type` in pops) {
        delete pops[`type`];
    }
    const { style, className, rest } = useBase(pops);
    const [visible, setVisible] = useState(false);
    return _jsxs(Box, { ...{
            style,
            className: `--password flex aic rel`
        }, children: [_jsx(Input, { ...{
                    ref,
                    type: visible ? 'text' : 'password',
                    className,
                    ...rest
                } }), _jsx(Button, { ...{
                    tabIndex: -1,
                    onClick: () => setVisible(prev => !prev),
                    className: `--toggle flex aic jcc abs`
                }, children: visible ? SVGIcons.eye : SVGIcons.eyeSlash })] });
});
export default OTP;
