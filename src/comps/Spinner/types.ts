import { ValueOf } from "../../types/shared";
import { BoxProps } from "../../types/interfaces";
import { Variant } from "../../types/enums";

export const SPINNER = {
    Simple : "SIMPLE",
    Roller : "ROLLER",
    Wave : "Wave"
} as const

export type SpinnerProps = BoxProps & {
    type?: ValueOf<typeof SPINNER>,
    variant?: ValueOf<typeof Variant> | number,
    width?: number,
    color?: string,
    background?: string,
    foreground?: string,
    speed?: number,
}