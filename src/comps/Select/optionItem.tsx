import React from "react";
import Box from "../Box";
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
    o,
    depth = 0,
    hasSubOptions = false,
    expanded = false,
    forceExpanded = false,
    onToggleExpand,
    renderOption,
} : OptionItemProps): React.ReactElement => {

    const check = checkIcon ? 
        typeof checkIcon === `string` ? <Icon name={`checkIcon`} /> 
            : checkIcon
                : SVGIcons.check;

    const isDisabled = o.disabled === true;
    const renderedOption = renderOption?.(o, {
        selected: selected === true,
        depth,
        hasSubOptions,
        expanded,
        forceExpanded,
    });

    return <Button
        onClick={(e) => {
            if ( isDisabled ) return
            e.stopPropagation()
            updateValue(o)
        }}
        disabled={isDisabled}
        style={{ "--select-option-indent": `${depth * 14}px` } as React.CSSProperties}
        as={`--select-option-item minW:max-content --no-shrink ${selected ? `--selected` : ``} ${isDisabled ? `--disabled` : ``} ${hasSubOptions ? `--has-sub-options` : ``} rel`.trim()}>
        {/* // className={value && (`string` == typeof o ? o : o.value) == (`string` == typeof value ? value : value.value) ? `selected` : ``}> */}
            <Flex as={`--option-item-meta --aic ${hasSubOptions ? `--is-parent` : ``}`}>
                {hasSubOptions ? <Box
                    role="button"
                    aria-label={expanded || forceExpanded ? "Collapse" : "Expand"}
                    aria-disabled={forceExpanded ? "true" : undefined}
                    tabIndex={forceExpanded ? -1 : 0}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (forceExpanded) return;
                        onToggleExpand?.();
                    }}
                    onKeyDown={(e: React.KeyboardEvent) => {
                        if (forceExpanded) return;
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            e.stopPropagation();
                            onToggleExpand?.();
                        }
                    }}
                    className={`--subtree-toggle --toggle-${expanded || forceExpanded ? `open` : `closed`}`.trim()}>
                    {expanded || forceExpanded ? SVGIcons.chevronBottom : SVGIcons.chevronRight}
                </Box> : null}
                {renderedOption ?? <>
                    { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor} /> }
                    <Text suppressHydrationWarning>{`string` == typeof o ? o : o.label}</Text>
                </>}
            </Flex>
            <Flex aic jcc as={`--select-option-check ${selected ? `` : `dim-0`}`}>
                {check}
            </Flex>
            {/* { o.icon && <Icon name={o.icon} as={`--select-option-icon --icon-${o.value}`} color={o.iconColor || undefined} /> }
            <Text suppressHydrationWarning>{`string` == typeof o ? o : o.label}</Text> */}
        </Button>
}

OptionItem.displayName = `Zuz.SelectOption`

export default OptionItem