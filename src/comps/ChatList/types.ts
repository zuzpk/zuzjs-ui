import { ReactNode } from "react";
import { BubbleProps } from "../ChatBubble/types";

export type ChatMessage = BubbleProps;

export type ChatDateLabels = {
    today?: ReactNode;
    yesterday?: ReactNode;
};

export type ChatDateLabelFormatter = (timeStamp: number, context: {
    date: Date;
    dayDiff: number;
    locale?: string;
    labels: Required<ChatDateLabels>;
}) => ReactNode;

export interface ChatListProps {
    messages: ChatMessage[];
    autoScroll?: boolean;
    smoothScroll?: boolean;
    bottomThreshold?: number;
    onScrollTop?: () => void;
    typing?: boolean | string;
    dateLabels?: ChatDateLabels;
    locale?: string;
    formatDateLabel?: ChatDateLabelFormatter;
}
