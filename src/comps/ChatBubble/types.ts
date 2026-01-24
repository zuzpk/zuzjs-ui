import { BoxProps } from "../Box"

export enum BubbleStatus {
    Sending = 0,
    Sent = 1,
    Delivered = 2,
    Read = 3
}

export enum BubbleMediaType {
    Image = "img",
    Video = "vid",
    Audio = "audio",
    Link = "link",
    Document = "doc",
    Location = "loc",
    Contact = "contact",
    Event = "event",
    Poll = "poll",
}

export type BubbleProps = BoxProps & {
    text?: string,
    media?: {
        type: BubbleMediaType,
        source: string,
        duration?: string
    },
    side?: "me" | "you",
    status?: BubbleStatus,
    timeStamp?: number,
    arrow?: boolean
}