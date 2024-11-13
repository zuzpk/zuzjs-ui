import { MenuItemProps } from "./types";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";

const MenuItem = (props: MenuItemProps) => {

    const { label, labelColor, icon, iconColor, index, className, onSelect } = props as MenuItemProps;
    return label == `-` ? <Box className={`--line`} /> 
        : <Button
            onClick={e => onSelect()}
            className={`--item flex aic ${className}`.trim()}>
            <Icon 
                name={icon}
                className={`--ico`}
                style={iconColor ? { color: iconColor } : {}} />
            <Text
                className={`--lbl flex aic`}
                style={labelColor ? { color: labelColor } : {}}>{label}</Text>
        </Button>
}

export default MenuItem;