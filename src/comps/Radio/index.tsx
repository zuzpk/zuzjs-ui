'use client'
import { ChangeEvent, forwardRef, useEffect, useRef, useState } from "react";
import { RadioHandler, RadioProps } from "./types";
import Label, { LabelProps } from "../Label";
import { RADIO, Size } from "../../types/enums";
import Input, { InputProps } from "../Input";
import Box from "../Box";

const Radio = forwardRef<RadioHandler, RadioProps>((props, ref) => {

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
                console.log(`from p trigger`)
                onSwitch && onSwitch(e.target.checked, value || `cb`)
                _setChecked(e.target.checked)
            }} />
        <Box className={`--dot rel`}>
            <Box className={`--rod abs abc`} />
        </Box>
        <Box className={`--value`}>{children}</Box>
        
    </Label>

})

export default Radio
