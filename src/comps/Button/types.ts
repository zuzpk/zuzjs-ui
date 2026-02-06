import { Ref } from "react"
import { Props, ValueOf, Variant } from "../../types"
import { SPINNER } from "../Spinner/types"

export type ButtonProps = Props<`button`> & {
    ref?: Ref<HTMLButtonElement>,
    icon?: string | null,
    iconSize?: ValueOf<typeof Variant>,
    withLabel?: boolean,
    spinner?: typeof SPINNER[keyof typeof SPINNER],
    state?: ButtonState,
    variant?: ValueOf<typeof Variant>,
    reset?: boolean
}

export interface ButtonHandler extends HTMLButtonElement {
    reset: () => void,
    setState: ( mod: ButtonState ) => void,
}

export const ButtonState = {
    Loading : `loading`,
    Normal: `normal`,
}

export type ButtonState = typeof ButtonState[keyof typeof ButtonState]