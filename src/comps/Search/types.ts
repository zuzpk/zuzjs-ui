import { ReactNode } from "react";
import { InputProps } from "../Input/types";
import { KeyCombination } from "../KeyboardKeys/types";

export type SearchProps = Omit<InputProps, `onChange` | `onSubmit`> & {
    onSubmit?: (value: string) => void,
    onChange?: (value: string) => void,
    onClear?: () => void,
    withStyle?: string,
    shortcut?: KeyCombination,
    reverse?: boolean,
    searchIcon?: string | ReactNode,
    hideSearchIcon?: boolean,
    clearIcon?: string | ReactNode,
    hideClearIcon?: boolean,
    clearOnSubmit?: boolean,
}

export interface SearchHandler {
    focus: () => void,
    setValue: (q: string) => void
}