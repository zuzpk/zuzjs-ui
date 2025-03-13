import { SegmentProps } from "../..";

export type ColorSchemeProps = Omit<SegmentProps, `items`> & {
    type?: "switch" | "toggle" | "system"
}