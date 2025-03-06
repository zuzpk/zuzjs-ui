import { Option } from "./types";
declare const Select: import("react").ForwardRefExoticComponent<Omit<import("..").BoxProps, "onChange"> & {
    required?: import("../..").FORMVALIDATION;
    options: Option[];
    label?: string;
    selected?: string | Option;
    search?: boolean;
    onChange?: (v: Option) => void;
    searchPlaceholder?: string;
} & import("react").RefAttributes<HTMLDivElement>>;
export default Select;
