import { BoxProps, POSITION, ValueOf } from "../../types"

export type ToolTipProps = BoxProps & {
    position?: ValueOf<typeof POSITION>,
    margin?: number
}