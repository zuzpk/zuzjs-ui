import { BoxProps } from "../Box"

export enum TOOLTIP {
    Top = 'top',
    Bottom = 'bottom',
    Left = 'left',
    Right = 'right',
}

export type ToolTipProps = BoxProps & {
    dir?: TOOLTIP
}