import { InputProps } from "../Input/types"

export type AutoCompleteProps = InputProps & {
    action?: string,
    data?: string[],
    withStyle?: string
}