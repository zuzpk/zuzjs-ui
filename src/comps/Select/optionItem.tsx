import React from "react";
import Button from "../Button";
import Flex from "../Flex";
import Icon from "../Icon";
import SVGIcons from "../svgicons";
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
const OptionItem = ({ 
    checkIcon, 
    selected,
    updateValue, 
    o 
} : OptionItemProps): React.ReactElement => {

    const check = checkIcon ? 
        typeof checkIcon === `string` ? <Icon name={`checkIcon`} /> 
            : checkIcon
                : SVGIcons.check;

    const isDisabled = o.disabled === true;

    return <Button
        onClick={(e) => {
            if ( isDisabled ) return
            e.stopPropagation()
            updateValue(o)
        }}
        disabled={isDisabled}
        as={`--select-option-item ${selected ? `--selected` : ``} ${isDisabled ? `--disabled` : ``} rel`.trim()}>
        {/* // className={value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}> */}
            <Flex>
                { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor} /> }
                <Text suppressHydrationWarning>{`string` == typeof o ? o : o.label}</Text>
            </Flex>
            { selected && <Flex aic jcc as={`--select-option-check --abs`}>
                {check}
            </Flex> }
            {/* { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor || undefined} /> }
            <Text suppressHydrationWarning>{`string` == typeof o ? o : o.label}</Text> */}
        </Button>
}

OptionItem.displayName = `Option`

export default OptionItem