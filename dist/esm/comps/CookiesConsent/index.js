"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { forwardRef, useEffect, useState } from "react";
import { Position, TRANSITION_CURVES } from "../../types/enums";
import Box from "../Box";
import Button from "../Button";
import Text from "../Text";
const CookiesConsent = forwardRef((props, ref) => {
    const [accepted, setAccepted] = useState(`wait`);
    const { title, message, acceptLabel, rejectLabel, position } = props;
    const handleAction = async (action) => {
        setAccepted(action == 1 ? `accepted` : `rejected`);
        localStorage.setItem('--ccnt', String(action));
    };
    useEffect(() => {
        const action = localStorage.getItem('--ccnt');
        setAccepted(action ? action == `1` ? `accepted` : `rejected` : `pending`);
    }, []);
    return _jsxs(Box, { animate: {
            from: { x: -1000 },
            to: { x: 0 },
            when: accepted == `pending`,
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.5,
            delay: accepted == `accepted` ? 0 : 3
        }, as: `--cookie-consent --${accepted} --${position || Position.Left} flex cols`, children: [_jsx(Text, { as: `--title`, children: title || `This site uses cookies` }), _jsx(Text, { as: `--message`, children: message || `We and selected third parties use cookies (or similar technologies) for technical purposes, to enhance and analyze site usage, to support our marketing efforts` }), _jsxs(Box, { as: `--footer flex aic`, children: [_jsx(Button, { onClick: e => handleAction(1), as: `--accept`, children: acceptLabel || `Accept All` }), _jsx(Button, { onClick: e => handleAction(0), as: `--reject`, children: rejectLabel || `Cancel` })] })] });
});
CookiesConsent.displayName = `CookiesConsent`;
export default CookiesConsent;
