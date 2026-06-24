import parsePhoneNumberFromString, { CountryCode } from "libphonenumber-js";
import React, { useEffect, useState } from "react";
import Countries from "../../funs/countries";
import { Variant } from "../../types";
import Flex from "../Flex";
import Input from "../Input";
import Select from "../Select";
import { Option } from "../Select/types";
import { PhoneInputProps } from "./types";

const PhoneInput = ({
    ref,
    value,
    variant,
    as,
    hideCountryName = false,
    placeholder,
    onChange,
    ...props
} : PhoneInputProps) => {
    // Default to Pakistan (PK) or whatever your primary demographic is
    const [country, setCountry] = useState<CountryCode>((value?.countryCode || "PK").toUpperCase() as CountryCode);
    const [phoneNumber, setPhoneNumber] = useState<string>(value?.rawInput || "");

    const activeCountryData = Countries.find(c => c.code === country);

    useEffect(() => {
        const parsed = parsePhoneNumberFromString(phoneNumber, country);
        
        const isValid = parsed ? parsed.isValid() : false;
        // Meta formats demand string digits without leading plus signs or layout spaces
        const metaFormat = parsed ? parsed.number.replace("+", "") : "";

        if (onChange) {
            onChange({
                rawInput: phoneNumber,
                countryCode: country,
                isValid,
                metaFormat
            });
        }
    }, [phoneNumber, country]);

    const handleCountryChange = (val: Option) => {
        setCountry(String(val.value).toUpperCase() as CountryCode);
    };

    const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    return (
        <Flex as={`--phone-input --${variant ?? Variant.Medium} ${as ?? ``}`} aic gap={2}>
            <Select
                expanded 
                search
                selected={country.toLowerCase()}
                onChange={handleCountryChange as any}
                options={Countries.map((c) => ({ 
                    label: hideCountryName === true ? c.dialCode : `${c.name} (${c.dialCode})`, 
                    value: c.code.toLowerCase() 
                }))} 
                variant={variant}
            />

            <Input 
                {...props}
                variant={variant}
                ref={ref}
                type={`number`}
                value={phoneNumber}
                onChange={handleNumberChange}
                placeholder={ placeholder ? placeholder : activeCountryData ? `e.g. ${activeCountryData.dialCode} 300 1234567` : "0300 1234567"} 
            />
        </Flex>
    );
}

export default PhoneInput;