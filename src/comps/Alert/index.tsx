"use client"
import { forwardRef, useId } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import { ALERT, Variant } from "../../types/enums";
import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
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
    
    const { type = ALERT.Info, icon, title, message, iconSize, variant, actions, ...pops } = props;

    const {
        className = '',
        style,
        rest
    } = useBase(pops);

    const keyId = useId();

    // Only use valid SVGIcons keys, fallback to 'info'
    const validIconKeys = Object.keys(SVGIcons) as Array<keyof typeof SVGIcons>;
    const iconKey = (typeof type === 'string' && validIconKeys.includes(type as keyof typeof SVGIcons))
        ? (type as keyof typeof SVGIcons)
        : 'info';

    return (
        <Flex
            aic
            className={`--alert --${variant ?? Variant.Medium} --${type} ${className}`.trim()}
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
            { actions && <Flex aic gap={5}>{Array.isArray(actions) ?  actions.map((action, index) => (
                <Button 
                    key={`alert-action-${keyId}-${index}`} 
                    icon={action.icon}
                    kind={action.kind}
                    onClick={action.onClick}>
                    {action.label}
                </Button>
            )) : actions }</Flex>}
        </Flex>
    );


})

Alert.displayName = `Zuz.Alert`

export default Alert    