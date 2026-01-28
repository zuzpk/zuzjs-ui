import React from "react";
import { Icon, Text } from "..";
import Button from "../Button";
import { OptionItemProps } from "./types";


const OptionItem = ({ value, updateValue, o } : OptionItemProps): React.ReactElement => {

    return <Button
        onClick={(e) => updateValue(o)}
        as={`--select-option-item`}
        className={value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}>
            { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor || undefined} /> }
            <Text>{`string` == typeof o ? o : o.label}</Text>
        </Button>
}

OptionItem.displayName = `Option`

export default OptionItem