import Box from "../Box";
import Button from "../Button";
import Flex from "../Flex";
import Icon from "../Icon";
import Text from "../Text";
import { MenuItemProps } from "./types";

const MenuItem = (props: MenuItemProps) => {

    const { 
        label, labelColor, icon, iconColor, className, onSelect, enabled, hasSubmenu, onHover, itemRef,
        action
    } = props;

    const itemConfig = {
        label,
        labelColor,
        icon,
        iconColor,
        className,
        enabled,
        onSelect
    };

    const itemContent = <>
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
        <Flex as={`--label`}>
            <Text
                className={`--lbl flex aic`}
                style={labelColor ? { color: labelColor } : {}}>{label}</Text>
        </Flex>
        {hasSubmenu ? <Text as={`span`} className={`--submenu-caret`}>▸</Text> : null}
        
        {/* FIX: Wrap the action in a container that halts event propagation.
          This stops click/mousedown from bubbling up and triggering menu auto-dismissal.
        */}
        {action ? (
            <Box 
                className={`--action-wrapper`}
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
            >
                {action}
            </Box>
        ) : null}
    </>;

    return label == `-` ? <Box className={`--line`} /> 
        : action ? <Flex 
            as={`--item ${enabled === false ? `--disabled` : ``} ${className || ``}`.trim()}>
            {/* Note: Removed raw {action} here since it's now handled inline inside itemContent safely */}
            {itemContent}
        </Flex>
        : <Button
            ref={itemRef as any}
            reset={true}
            onMouseEnter={onHover}
            onClick={(e) => {
                if ( enabled === false || hasSubmenu) return;
                onSelect?.(itemConfig);
            }}
            className={`--item ${enabled === false ? `--disabled` : ``} ${hasSubmenu ? `--has-submenu` : ``} ${className || ``}`.trim()}>
            {itemContent}
        </Button>
}

export default MenuItem;