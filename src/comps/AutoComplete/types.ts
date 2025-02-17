import { InputProps } from "../Input";

export type AutoCompleteProps = InputProps & {
    action?: string,
    data?: string[],
    withStyle?: string
}