"use client"
import { ChangeEvent, forwardRef, useRef, useState } from "react";
import { RADIO, Variant } from "../../types/enums";
import Box from "../Box";
import Input from "../Input";
import Label, { LabelProps } from "../Label";
import { RadioHandler, RadioProps } from "./types";
import { InputProps } from "../Input/types";
import { useTheme } from "../../hooks/useColorScheme";

/**
 * Radio component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <Radio label="Option 1" value="opt1" onChange={(val) => console.log(val)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <Radio label="Option 1" value="opt1" defaultChecked={true} variant="primary" />
 * ```
 * @param label - Label text for the component
 * @param value - Current value
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param variant - Visual variant or style
 */
const Radio = forwardRef<RadioHandler, RadioProps>((props, _ref) => {

    const { children, className, name, required, type, value, variant, checked: defaultCheck, onSwitch, ...pops } = props;
    const [ checked, _setChecked ] = useState(defaultCheck || false)
    const { variant: themeVariant } = useTheme(true)!
    const bRef = useRef<HTMLInputElement>(null)

    return <Label
        className={`${className} --${(type || RADIO.Default).toLowerCase()} --radio${!type || type == RADIO.Default ? `` : `card`} --${variant || themeVariant || Variant.Small} flex aic rel`.trim()}
        {...pops as LabelProps }>
        <Input
            {...{} as InputProps}
            ref={bRef} 
            defaultChecked={checked}
            value={value || `rd`}
            type={`radio`}  
            className={`abs`}
            name={name}
            required={required || false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                if( onSwitch ) onSwitch(e.target.checked, value || `cb`)
                _setChecked(e.target.checked)
            }} />
        <Box className={`--dot rel`}>
            <Box className={`--rod abs abc`} />
        </Box>
        <Box className={`--value`}>{children}</Box>
        
    </Label>

})

Radio.displayName = `Zuz.Radio`

export default Radio
