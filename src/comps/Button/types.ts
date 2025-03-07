import { Props } from "../../types"
import { Size, SPINNER, Variant } from "../../types/enums"

export type ButtonProps = Props<`button`> & {
    icon?: string | null,
    iconSize?: Size,
    withLabel?: boolean,
    spinner?: SPINNER,
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