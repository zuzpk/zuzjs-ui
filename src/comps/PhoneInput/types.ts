import { CountryCode } from "libphonenumber-js";
import { InputProps } from "../Input/types";

export type PhoneInputValue = {
  rawInput: string;         // Exactly what the user typed (e.g. "0300 1234567")
  countryCode: CountryCode; // e.g. "PK"
  isValid: boolean;         // true/false based on libphonenumber-js
  metaFormat: string;       // Pure clean digits for Meta API (e.g. "923001234567")
};

export type PhoneInputProps = Omit<InputProps, 'onChange' | 'value'> & {
  value?: { countryCode: CountryCode; rawInput: string };
  onChange?: (value: PhoneInputValue) => void;
};