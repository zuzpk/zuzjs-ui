import { Deprecated, Props } from "../../types"
import { Size, Variant } from "../../types/enums"
import { SpinnerProps } from "../Spinner"

export type ButtonProps = Props<`button`> & {
    icon?: string,
    iconSize?: Size,
    withLabel?: boolean,
    spinner?: SpinnerProps,
    state?: ButtonState,
    /**
     * @deprecated "Use `variant` instead. `size` will be removed in the next major release."
     */
    size?: Size,
    variant?: Size | Variant,
    reset?: boolean
}

export interface ButtonHandler extends HTMLButtonElement {
    reset: () => void,
    setState: ( mod: ButtonState ) => void,
}

export enum ButtonState {
    Loading = `loading`,
    Normal = `normal`,
}