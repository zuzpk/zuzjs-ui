import React from "react";
import Button from "../Button";
import Icon from "../Icon";
import Text from "../Text";
import { OptionItemProps } from "./types";

/**
 * OptionItem component renders an individual selectable item within the Select dropdown.
 * 
 * @param {OptionItemProps} props - The properties for the OptionItem component.
 * @param {Option} props.value - The currently selected option value.
 * @param {Function} props.updateValue - Callback function to update the selected value.
 * @param {Option} props.o - The option object to be rendered.
 */
const OptionItem = ({ value, updateValue, o } : OptionItemProps): React.ReactElement => {

    return <Button
        onClick={(e) => updateValue(o)}
        as={`--select-option-item`}
        className={value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}>
            { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor || undefined} /> }
            <Text suppressHydrationWarning>{`string` == typeof o ? o : o.label}</Text>
        </Button>
}

OptionItem.displayName = `Option`

export default OptionItem