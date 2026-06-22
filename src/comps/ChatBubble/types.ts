import { ReactNode } from "react";
import { BoxProps } from "../../types";
import { AVATAR } from "../../types/enums";
import { ValueOf } from "../../types/shared";

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

export enum BubbleAttachmentType {
    File = "file",
    Image = "image",
    Video = "video",
    Audio = "audio",
    Link = "link",
}

export type BubbleStylePreset =
    | "default"
    | "ios"
    | "android"
    | "blocks"
    | "glass"
    | "minimal";

export type BubbleAttachment = {
    id?: string | number,
    type?: BubbleAttachmentType,
    name: string,
    url: string,
    size?: string,
    preview?: string,
};

export type BubbleProps = BoxProps & {
    id?: string | number,
    sender?: {
        id: string;
        name: string;
        picture?: string;
        color?: string;
    },
    text?: string,
    hideAvatar?: boolean,
    avatarType?: ValueOf<typeof AVATAR>,
    hideName?: boolean,
    media?: {
        type: BubbleMediaType,
        source: string,
        duration?: string,
        thumbnail?: string,
        title?: string,
    },
    side?: "me" | "you",
    stylePreset?: BubbleStylePreset,
    status?: BubbleStatus,
    timeStamp?: number,
    arrow?: boolean,
    attachments?: BubbleAttachment[],
    /** Auto-fetch and display link previews from URLs in text */
    autoFetchLinkPreview?: boolean,
    /** Optional custom preview fetcher for links found in text */
    linkPreviewFetcher?: (url: string) => Promise<{
        title?: string,
        description?: string,
        image?: string,
        url?: string,
    } | null>,
    /** Message this bubble is replying to */
    replyTo?: {
        author: string,
        text: string,
        id?: string | number,
    },
    /** Array of emoji reactions */
    reactions?: string[],
    /** Whether this message is forwarded */
    forwarded?: boolean,
    /** Complex nested content support */
    children?: ReactNode,
}