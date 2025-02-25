import { Props } from "../../types"
import { Size, Variant } from "../../types/enums"
import { SpinnerProps } from "../Spinner"

/**
 * @deprecated Use `variant` instead.
 */
export type ButtonProps = Props<`button`> & {
    icon?: string,
    iconSize?: Size,
    withLabel?: boolean,
    spinner?: SpinnerProps,
    state?: ButtonState,
    size?: Size, // @deprecated Use `variant` instead.
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