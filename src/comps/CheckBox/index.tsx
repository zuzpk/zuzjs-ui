"use client"
import { ChangeEvent, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { CHECKBOX, Size, Variant } from "../../types/enums";
import Label, { LabelProps } from "../Label";
import Input, { InputProps } from "../Input";
import { CheckboxHandler, CheckBoxProps } from "./types";
import SVGIcons from "../svgicons";

const CheckBox = forwardRef<CheckboxHandler, CheckBoxProps>((props, ref) => {
    
    const { name, required, type, value, size, variant, checked: defaultCheck, onSwitch, ...pops } = props;
    const [ checked, _setChecked ] = useState(defaultCheck || false)

    const bRef = useRef<HTMLInputElement>(null)

    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange=true){
            _setChecked(mod)
            if (bRef.current) {
                bRef.current.checked = mod;
            }
            if ( triggerChange && onSwitch )
                onSwitch(mod, value || `cb`)
        },
        toggle(triggerChange=true){
            if (bRef.current)
                bRef.current.checked = !checked;
            
            if ( triggerChange && onSwitch )
                onSwitch && onSwitch(!checked, value || `cb`)

            _setChecked(!checked)            
        }
    }))

    return <Label 
        className={`--${(type || CHECKBOX.Default).toLowerCase()} ${!type || type == CHECKBOX.Default ? `--checkbox` : `--switch`} --${(variant || size) || Variant.Default} flex aic jcc ${checked ? `is-checked` : ``} rel`.trim()}
        {...pops as LabelProps } >
        {(!type || type == CHECKBOX.Default) && SVGIcons.check}
        <Input
            {...{} as InputProps}
            ref={bRef} 
            defaultChecked={checked}
            value={value || `cb`}
            type={`checkbox`}  
            className={`abs`}
            name={name}
            required={required || false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                onSwitch && onSwitch(e.target.checked, value || `cb`)
                _setChecked(e.target.checked)
            }} />
    </Label>

});


export default CheckBox