"use client"
import { ChangeEvent, Ref, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { useTheme } from "../../hooks/useColorScheme";
import { CHECKBOX, Variant } from "../../types/enums";
import { useFormActions, useFormFieldError, useFormFieldValue } from "../Form/context";
import Input from "../Input";
import { InputProps } from "../Input/types";
import Label, { LabelProps } from "../Label";
import SVGIcons from "../svgicons";
import { CheckboxHandler, CheckBoxProps } from "./types";

/**
 * CheckBox component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <CheckBox label="I agree" onChange={(checked) => console.log(checked)} />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <CheckBox label="Remember me" defaultChecked={true} disabled={false} variant="primary" />
 * ```
 * @param label - Label text for the component
 * @param onChange - Callback function triggered when value changes
 * @param defaultChecked - Whether component is checked by default
 * @param variant - Visual variant or style
 */
const CheckBox = ({
    ref,
    ...props
}: CheckBoxProps & {
    ref?: Ref<CheckboxHandler>
}) => {
    
    const { name, required, type, value, size, variant, checked: defaultCheck, disabled, onSwitch, ...pops } = props;

        const form = useFormActions()
        const setFieldValue = form?.setFieldValue
        const inForm = Boolean(name && setFieldValue)
        const error = useFormFieldError(name)
        const formValue = useFormFieldValue(name)

    const [ _checked, _setChecked ] = useState( defaultCheck || false )
    const bRef = useRef<HTMLInputElement>(null)
    const { variant: themeVariant } = useTheme(true)!

    const isChecked = useMemo(() => {
        // If it's in a form, priority goes to formValue (even if false/true)
        if (inForm && formValue != undefined) {
            if (typeof formValue === 'string') {
                return formValue.toLowerCase() !== 'false' && formValue !== '';
            }
            return !!formValue; 
        }
        return _checked;
    }, [formValue, _checked, inForm]);

    useEffect(() => {
        if (bRef.current && bRef.current.checked !== isChecked) {
            bRef.current.checked = isChecked;
        }
    }, [isChecked]);

    useEffect(() => {
        if (defaultCheck !== undefined) _setChecked(defaultCheck);
    }, [defaultCheck]);

    // useEffect(() => {
    //     if (bRef.current && name && formValue !== undefined) {
    //         if (bRef.current.checked !== formValue) {
    //             bRef.current.checked = formValue;
    //         }
    //     }
    // }, [formValue, name]);

    const handleChange = (bool: boolean) => {
        const cleanBool = !!bool;
        if (inForm && name) {
            setFieldValue?.(name, cleanBool)
        }
        _setChecked(cleanBool);
        onSwitch?.(cleanBool, value || `cb`);
    };

    useImperativeHandle(ref, () => ({
        setChecked(mod, triggerChange = true) {
            handleChange(mod);
        },
        toggle(triggerChange = true) {
            handleChange(!isChecked);
        }
    }));
    
    return <Label 
        aria-hidden={disabled}
        className={[
            `--${(type || CHECKBOX.Default).toLowerCase()}`, 
            `${!type || type === CHECKBOX.Default ? `--checkbox` : `--switch`}`, 
            `--${(variant || themeVariant) || Variant.Small}`,
            `flex aic jcc ${isChecked ? `is-checked` : ``} rel`,
            `${disabled ? `--disabled` : ``}`
        ].join(` `).trim()}
        {...pops as LabelProps } >
        {(!type || type == CHECKBOX.Default) && SVGIcons.check}
        <Input
            {...{} as InputProps}
            ref={(node) => {
                // Handle both our internal ref and the forwarded ref
                (bRef as any).current = node;
                // if (typeof ref === 'function') ref(node);
                if (ref) (ref as any).current = node;
            }} 
            defaultChecked={isChecked}
            // value={value || `cb`}
            type={`checkbox`}  
            className={`abs`}
            name={name}
            required={required || false}
            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                e.stopPropagation()
                handleChange(e.target.checked);
            }}
            disabled={disabled}
            // onChange={(e: ChangeEvent<HTMLInputElement>) => {
            //     onSwitch && onSwitch(e.target.checked, value || `cb`)
            //     _setChecked(e.target.checked)
            //     if ( name ) formActions?.setFieldValue(name, e.target.checked)
            // }} 
            />
    </Label>

}

CheckBox.displayName = `Zuz.CheckBox`

export default CheckBox