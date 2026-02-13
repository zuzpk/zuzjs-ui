import { Variant } from "../../types/enums";
import { BoxProps } from "../../types/interfaces";
import { ValueOf } from "../../types/shared";

export const SPINNER = {
    Simple : "SIMPLE",
    Roller : "ROLLER",
    Wave : "Wave"
} as const

export type SpinnerProps = BoxProps & {
    type?: ValueOf<typeof SPINNER>,
    variant?: ValueOf<typeof Variant>
}