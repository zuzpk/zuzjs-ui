import { ReactNode } from "react"
import { Size, Variant } from "../../types/enums"
import { BoxProps } from "../Box"

/**
 * Individual segment in the `SelectTabs` component.
 * @typedef {Object} Segment
 * @property {number} index - The index of the segment.
 * @property {string} [icon] - The optional icon to display for the segment.
 * @property {string} [label] - The optional label to display for the segment.
 */
export interface Segment {
    tag?: string | number,
    index: number,
    icon?: ReactNode,
    label?: ReactNode
}

/**
 * Props for the `SelectTabs` component.
 * @typedef {Object} SegmentProps
 * @extends {Props<'div'>}
 * @property {number} [selected] - The index of the initially selected segment.
 * @property {Segment[]} items - Array of segments to display.
 */
export type SegmentProps = BoxProps & {
    /**
     * @deprecated use variant
     */
    size?: Size,
    variant?: Variant,
    selected?: number,
    onSwitch?: (segment: Segment) => void,
    items: Segment[]
}

export type SegmentItemProps = {
    meta: Segment,
    selected: boolean,
    onSelect: (index: number, width: number, x: number, segment: Segment, force: boolean) => void
}

export interface SegmentController {
    setSelected: (index: number) => void,
}