"use client"
import { forwardRef, useEffect, useState } from "react";
import { CookieConsentProps } from "./types";
import Box from "../Box";
import Text from "../Text";
import Button from "../Button";
import { Position, TRANSITION_CURVES } from "../../types/enums";

const CookiesConsent = forwardRef<HTMLDivElement, CookieConsentProps>((props, ref) => {

    const [ accepted, setAccepted ] = useState<`pending` | `accepted` | `rejected` | `wait`>(`wait`)
    const { title, message, acceptLabel, rejectLabel, position } = props

    const handleAction = async (action: 1 | 0) => {
        setAccepted(action == 1 ? `accepted` : `rejected`)
        localStorage.setItem('--ccnt', String(action))
    }

    useEffect(() => {
        const action = localStorage.getItem('--ccnt')
        setAccepted(action ? action == `1` ? `accepted` : `rejected` : `pending`)                    
    }, [])

    return <Box 
        animate={{
            from: { x: -1000 },
            to: { x: 0 },
            when: accepted == `pending`,
            curve: TRANSITION_CURVES.EaseInOut,
            duration: 0.5,
            delay: accepted == `accepted` ? 0 : 3
        }}
        as={`--cookie-consent --${accepted} --${position || Position.Left} flex cols`}>
        <Text as={`--title`}>{title || `This site uses cookies`}</Text>
        <Text as={`--message`}>{message || `We and selected third parties use cookies (or similar technologies) for technical purposes, to enhance and analyze site usage, to support our marketing efforts`}</Text>
        <Box as={`--footer flex aic`}>
            <Button 
                onClick={e => handleAction(1)}
                as={`--accept`}>{acceptLabel || `Accept All`}</Button>
            <Button 
                onClick={e => handleAction(0)}
                as={`--reject`}>{rejectLabel || `Cancel`}</Button>
        </Box>
    </Box>

})

export default CookiesConsent;