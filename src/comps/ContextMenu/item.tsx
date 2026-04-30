import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import { MenuItemProps } from "./types";

const MenuItem = (props: MenuItemProps) => {

    const { label, labelColor, icon, iconColor, className, onSelect, enabled } = props;

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
            reset={true}
            onClick={() => onSelect?.(itemConfig)}
            className={`--item ${className || ``}`.trim()}>
            <Box as={`--icon`}>
                {`string` === typeof icon ? <Icon 
                    name={icon}
                    className={`--ico`}
                    style={iconColor ? { color: iconColor } : {}} /> : icon}
            </Box>
            <Text
                className={`--lbl flex aic`}
                style={labelColor ? { color: labelColor } : {}}>{label}</Text>
        </Button>
}

export default MenuItem;