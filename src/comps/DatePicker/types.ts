import { ReactNode } from "react";
import { InputProps } from "../Input";

export type DatePickerProps = InputProps & {
    icon?: ReactNode | string;
    defaultValue?: Date | null;
}