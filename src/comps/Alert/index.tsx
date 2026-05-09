"use client"
import { forwardRef } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import { ALERT } from "../../types/enums";
import Box from "../Box";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { AlertHandler, AlertProps } from "./types";

/**
 * Alert component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Alert type="info">This is an informational alert</Alert>
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Alert type="warning" dismissible onDismiss={() => console.log('dismissed')} icon="alert_circle">Warning: Please review the details</Alert>
 * ```
 * @param type - Component or input type
 * @param dismissible - dismissible prop
 * @param onDismiss - Callback function triggered on dismissal
 * @param icon - Icon identifier
 */
const Alert = forwardRef<AlertHandler, AlertProps>((props, ref) => {
    
    const { type = ALERT.Info, icon, title, message, iconSize, ...pops } = props;

    const {
        className = '',
        style,
        rest
    } = useBase(pops);

    // Only use valid SVGIcons keys, fallback to 'info'
    const validIconKeys = Object.keys(SVGIcons) as Array<keyof typeof SVGIcons>;
    const iconKey = (typeof type === 'string' && validIconKeys.includes(type as keyof typeof SVGIcons))
        ? (type as keyof typeof SVGIcons)
        : 'info';

    return (
        <Box
            className={`--alert --${type} flex aic ${className}`.trim()}
            style={style}
            {...(rest as BoxProps)}
        >
            <Box
                className={`--icon icon-${icon || `auto-matic`}`}
                style={iconSize ? { fontSize: iconSize, width: iconSize, height: iconSize } : {}}
            >
                {!icon && SVGIcons[iconKey]}
            </Box>
            <Box className={`--meta flex cols`}>
                <Text className={`--title ${message ? `--tm` : ``}`}>
                    {title || `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`}
                </Text>
                {message && <Text className={`--message`} kind="h2">{message}</Text>}
            </Box>
        </Box>
    );


})

Alert.displayName = `Zuz.Alert`

export default Alert    