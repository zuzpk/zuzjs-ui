import { FC, useContext } from "react";
import { ToastContext } from ".";
import { ToastDefaultTitle, TRANSITION_CURVES, TRANSITIONS, useDelayed } from "../..";
import Box from "../Box";
import Icon from "../Icon";
import Text from "../Text";
import { ToastData } from "./types";

const Toast : FC<ToastData & {
    index: number,
}> = ({ index, id, type, icon, title, message, duration }) => {

    const mounted = useDelayed()
    const expired = useDelayed(((duration || 4) - 1) * 1000)
    const ctx = useContext(ToastContext)

    return <Box 
        as={`--snack --${type} --snack-${id} ${index > 2 ? `--snacked` : ``} flex aic`}
        fx={{
            from: { left: `50%`, x: `-50%`, top: -100, scale: 1, opacity: 0.5 },
            to: { left: `50%`, x: `-50%`, top: 25, scale: 1, opacity: 1 },
            // exit: { left: `50%`, x: `-50%`, top: 25, scale: 0, opacity: 0 },
            curve: ctx?.fx.curve,
            duration: ctx?.fx.duration,
            when: mounted && !expired
        }}>
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