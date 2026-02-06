import { ReactNode } from "react";
import { InputProps } from "../Input/types";

export type DatePickerProps = InputProps & {
    icon?: ReactNode | string;
    defaultValue?: Date | null;
}