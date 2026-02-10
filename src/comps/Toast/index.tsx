import { FC, useContext, useEffect } from "react";
import Box from "../Box";
import Icon from "../Icon";
import Text from "../Text";
import { ToastProps, ToastDefaultTitle } from "./types";
import { useDelayed } from "@zuzjs/hooks"
import { TRANSITION_CURVES, TRANSITIONS } from "../../types";
import { useTheme } from "../../hooks/useColorScheme";
import { useFx } from "../../hooks";

const Toast : FC<ToastProps & {
    index: number,
}> = ({ index, id, type, icon, title, message, duration, onClose }) => {

    const mounted = useDelayed()
    const expired = useDelayed(((duration || 4) - 1) * 1000)
    const {
        toast: themeToast
    } = useTheme(true)!

    // const toastAnimation = useFx({
    //     from: { left: `50%`, x: `-50%`, top: -100, scale: 1, opacity: 0.5 },
    //     to: { left: `50%`, x: `-50%`, top: 25, scale: 1, opacity: 1 },
    //     // exit: { left: `50%`, x: `-50%`, top: 25, scale: 0, opacity: 0 },
    //     curve: themeToast?.curve || TRANSITION_CURVES.EaseInOut,
    //     duration: themeToast?.duration || 0.5,
    //     when: mounted && !expired
    // })

    const toastAnimation = useFx({
        when: mounted && !expired,
        duration: themeToast?.duration || 0.2,
        transition: TRANSITIONS.SlideInTop,
        curve: themeToast?.curve || TRANSITION_CURVES.EaseInOut,
    })

    useEffect(() => {
        console.log(`--expired`, expired, id)
        if ( expired && id ) {
            onClose?.(id)
        }
    }, [expired, id])

    return <Box 
        as={`--snack --${type} --snack-${id} ${index > 2 ? `--snacked` : ``} flex aic`}
        style={toastAnimation.style}>
        <Box 
            as={`--ico flex aic jcc`}
            fx={{
                transition: TRANSITIONS.ScaleIn,
                curve: TRANSITION_CURVES.Spring,
                delay: 0.2,
                when: mounted && !expired
            }}>
            { icon ? <Icon 
                name={icon} 
                fx={{
                    transition: TRANSITIONS.ScaleIn,
                    curve: TRANSITION_CURVES.Spring,
                    delay: 0.4,
                    duration: 0.5,
                    when: mounted && !expired
                }} /> : <Box 
                    as={`--no-icon`} 
                    fx={{
                        transition: TRANSITIONS.ScaleIn,
                        curve: TRANSITION_CURVES.Spring,
                        delay: 0.4,
                        duration: 0.5,
                        when: mounted && !expired
                    }} /> }
        </Box>
        <Box as={`--meta`}>
            <Text 
                as={`--tt`}
                fx={{
                    transition: TRANSITIONS.SlideInTop,
                    curve: TRANSITION_CURVES.Spring,
                    delay: 0.3,
                    when: mounted
                }}>{title || ToastDefaultTitle[type]}</Text>
            <Text 
                as={`--tm`} 
                fx={{
                    transition: TRANSITIONS.SlideInTop,
                    curve: TRANSITION_CURVES.Spring,
                    delay: 0.4,
                    duration: 0.5,
                    when: mounted
                }}>{message}</Text>
        </Box>
    </Box>
}

export default Toast;