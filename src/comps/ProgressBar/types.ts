import { ValueOf } from "../../types"
import { PROGRESS } from "../../types/enums"
import { BoxProps } from "../../types/interfaces"

export type ProgressBarProps = BoxProps & {
    progress?: number,
    type?: ValueOf<typeof PROGRESS>,
    animated?: boolean,
}

export interface ProgressHandler {
    setProgress?: (p : number) => void,
    getProgress?: () => number,
}