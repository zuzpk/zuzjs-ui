import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import { MenuItemProps } from "./types";

const MenuItem = (props: MenuItemProps) => {

    const { label, labelColor, icon, iconColor, index, className, onSelect } = props as MenuItemProps;

    return label == `-` ? <Box className={`--line`} /> 
        : <Button
            reset={true}
            onClick={e => onSelect()}
            className={`--item ${className || ``}`.trim()}>
            <Box as={`--icon`}>
                <Icon 
                    name={icon}
                    className={`--ico`}
                    style={iconColor ? { color: iconColor } : {}} />
            </Box>
            <Text
                className={`--lbl flex aic`}
                style={labelColor ? { color: labelColor } : {}}>{label}</Text>
        </Button>
}

export default MenuItem;