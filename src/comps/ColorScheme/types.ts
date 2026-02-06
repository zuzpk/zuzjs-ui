import { SegmentProps } from "../Segmented/types"

export type ColorSchemeProps = Omit<SegmentProps, `items`> & {
    type?: "switch" | "toggle" | "system"
}