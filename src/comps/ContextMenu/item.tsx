import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import { MenuItemProps } from "./types";

const MenuItem = (props: MenuItemProps) => {

    const { label, labelColor, icon, iconColor, className, onSelect, enabled, hasSubmenu, onHover, itemRef } = props;

    const itemConfig = {
        label,
        labelColor,
        icon,
        iconColor,
        className,
        enabled,
        onSelect
    };

    return label == `-` ? <Box className={`--line`} /> 
        : <Button
            ref={itemRef as any}
            reset={true}
            onMouseEnter={onHover}
            onClick={() => {
                if (enabled === false || hasSubmenu) return;
                onSelect?.(itemConfig);
            }}
            className={`--item ${enabled === false ? `--disabled` : ``} ${hasSubmenu ? `--has-submenu` : ``} ${className || ``}`.trim()}>
            <Box as={`--icon`}>
                {`string` === typeof icon ? <Icon 
                    name={icon}
                    className={`--ico`}
                    style={(iconColor ? { 
                        color: iconColor,
                        "--icon-color-1": iconColor,
                        "--icon-color-2": `rgb(from var(--icon-color-1) r g b / var(--icon-alpha, 0.5))`
                    } : {}) as React.CSSProperties} /> : icon}
            </Box>
            <Text
                className={`--lbl flex aic`}
                style={labelColor ? { color: labelColor } : {}}>{label}</Text>
            {hasSubmenu ? <Text as={`span`} className={`--submenu-caret`}>▸</Text> : null}
        </Button>
}

export default MenuItem;