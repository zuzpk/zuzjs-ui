import { ReactNode } from "react"
import { KeyCombination } from "../.."
import { InputProps } from "../Input"

export type SearchProps = InputProps & {
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
}

export interface SearchHandler {
    focus: () => void
}