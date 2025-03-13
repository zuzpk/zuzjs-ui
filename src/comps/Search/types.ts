import { KeyCombination } from "../.."
import { InputProps } from "../Input"

export type SearchProps = InputProps & {
    onSubmit?: (value: string) => void,
    onChange?: (value: string) => void,
    withStyle?: string,
    shortcut?: KeyCombination,
    reverse?: boolean
}

export interface SearchHandler {
    focus: () => void
}