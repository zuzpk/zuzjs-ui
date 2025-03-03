"use client"
import { ChangeEvent, forwardRef, useRef, useState } from "react";
import { RADIO, Size } from "../../types/enums";
import Box from "../Box";
import Input, { InputProps } from "../Input";
import Label, { LabelProps } from "../Label";
import { RadioHandler, RadioProps } from "./types";

const Radio = forwardRef<RadioHandler, RadioProps>((props, _ref) => {

    const { children, className, name, required, type, value, size, checked: defaultCheck, onSwitch, ...pops } = props;
    const [ checked, _setChecked ] = useState(defaultCheck || false)

    const bRef = useRef<HTMLInputElement>(null)

    return <Label
        className={`${className} --${(type || RADIO.Default).toLowerCase()} --radio${!type || type == RADIO.Default ? `` : `card`} --${size || Size.Default} flex aic rel`.trim()}
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

export default Radio
