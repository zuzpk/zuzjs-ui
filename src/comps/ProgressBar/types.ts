import { PROGRESS } from "../../types/enums"
import { BoxProps } from "../Box"

export type ProgressBarProps = BoxProps & {
    progress?: number,
    type?: PROGRESS,
    animated?: boolean,
}

export interface ProgressHandler {
    setProgress?: (p : number) => void
}