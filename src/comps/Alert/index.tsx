import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { ALERT } from "../../types/enums";
import Box, { BoxProps } from "../Box";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { AlertHandler, AlertProps } from "./types";

const Alert = forwardRef<AlertHandler, AlertProps>((props, ref) => {
    
    const { type, icon, title, message, iconSize, ...pops } = props;

    const {
        className,
        style,
        rest
    } = useBase(pops)

    return <Box className={`--alert --${(type || ALERT.Info)} flex aic ${className}`.trim()} style={style} {...rest as BoxProps}>
        <Box className={`--icon icon-${icon || `auto-matic`}`} style={iconSize ? { fontSize: iconSize, width: iconSize, height: iconSize } : {}}>
            {!icon && SVGIcons[type || ALERT.Info]}
        </Box>
        <Box className={`--meta flex cols`}>
            <Text className={`--title ${message ? `--tm` : ``}`}>
                {title || `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
            </Text>
            {message && <Text className={`--message`} h={2}>{message}</Text>}
        </Box>
    </Box>


})

Alert.displayName = `Alert`

export default Alert    