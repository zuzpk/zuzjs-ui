import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChatBubble, Flex } from "..";
import Box from "../Box";
import Button from "../Button";
import { BubbleProps } from "../ChatBubble/types";
import List from "../List";
import { ListHandler, ListItem } from "../List/types";
import ScrollView from "../ScrollView";
import Span from "../Span";
import Text from "../Text";
import { ChatDateLabels, ChatListProps } from "./types";

const DEFAULT_DATE_LABELS: Required<ChatDateLabels> = {
    today: "Today",
    yesterday: "Yesterday",
};

/**
 * ChatList component optimized for performance with auto-scroll and unread indicator.
 * - Auto scrolls to bottom when new messages arrive
 * - Allows manual scroll without disruption
 * - Shows unread message count when scrolled up
 * - Memoizes child components for optimal rendering
 */
const ChatList = memo(({
    messages,
    autoScroll = true,
    smoothScroll = false,
    bottomThreshold = 24,
    onScrollTop,
    typing,
    dateLabels,
    locale,
    formatDateLabel,
    hideAvatar = false,
    hideName = false,
    arrow,
    avatarType
}: ChatListProps & BubbleProps) => {
    const shellRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<ListHandler>(null);
    const hasMountedRef = useRef(false);
    const hasInitialAutoScrolledRef = useRef(false);
    const isAtBottomRef = useRef(true);
    const requestedTopRef = useRef(false);
    
    const [unreadCount, setUnreadCount] = useState(0);
    const [shouldShowUnread, setShouldShowUnread] = useState(false);
    const lastMessageCountRef = useRef(messages.length);

    const mergedDateLabels = useMemo<Required<ChatDateLabels>>(() => ({
        ...DEFAULT_DATE_LABELS,
        ...(dateLabels || {}),
    }), [dateLabels]);

    const getScrollElement = useCallback(() => {
        return shellRef.current?.querySelector(".--scroll-content") as HTMLDivElement | null;
    }, []);

    const isAtBottom = useCallback((container: HTMLDivElement) => {
        return container.scrollHeight - container.scrollTop - container.clientHeight < bottomThreshold;
    }, [bottomThreshold]);

    const scrollToBottom = useCallback((container: HTMLDivElement) => {
        requestAnimationFrame(() => {
            if (typeof container.scrollTo === "function") {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: smoothScroll ? "smooth" : "auto",
                });
            } else {
                container.scrollTop = container.scrollHeight;
            }
        });
    }, [smoothScroll]);

    const getDateMeta = useCallback((timeStamp?: number) => {
        const ts = timeStamp || Date.now();
        const d = new Date(ts);
        const now = new Date();
        const y = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const t = new Date(d.getFullYear(), d.getMonth(), d.getDate());
        const dayDiff = Math.floor((y.getTime() - t.getTime()) / 86400000);
        const key = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;

        const labels = mergedDateLabels;

        const label = formatDateLabel
            ? formatDateLabel(ts, { date: d, dayDiff, locale, labels })
            : dayDiff === 0
                ? labels.today
                : dayDiff === 1
                    ? labels.yesterday
                    : d.toLocaleDateString(locale);

        return { key, label };
    }, [formatDateLabel, locale, mergedDateLabels]);

    // Memoize rendered messages
    const renderedMessages = useMemo<ListItem[]>(() => {
        return messages.flatMap((m, i) => {
            const prev = messages[i - 1];
            const currentDateMeta = getDateMeta(m.timeStamp);
            const prevDateMeta = prev
                ? getDateMeta(prev.timeStamp)
                : null;
            const showDate = i === 0 || currentDateMeta.key !== prevDateMeta?.key;
            const showArrow = i === 0 || prev?.side !== m.side || currentDateMeta.key !== prevDateMeta?.key;

            const rows: ListItem[] = [];
            if (showDate) {
                rows.push(
                    <Box key={`date-${currentDateMeta.key}-${i}`} as={`--chat-date flex aic jcc p:8,0`}>
                        <Text as={`s:xs dim-50`}>{currentDateMeta.label}</Text>
                    </Box>
                );
            }

            rows.push(
                <ChatBubble
                    key={m.id || i}
                    {...m}
                    arrow={m.arrow ?? arrow ?? showArrow}
                    avatarType={avatarType}
                    hideAvatar={hideAvatar}
                    hideName={hideName}
                />
            );

            return rows;
        });
    }, [messages, getDateMeta]);

    const listItems = useMemo<ListItem[]>(() => {
        if (!typing) return renderedMessages;
        return [
            ...renderedMessages,
            <Box key="typing-row" as={`flex jcs p:4,8`}>
                <Box as={`--bubble --bubble-you --typing-indicator rel flex cols`}>
                    <Text as={`s:xs dim-75`}>{typeof typing === "string" ? typing : "Typing"}</Text>
                    <Box as={`flex aic gap:4`}>
                        <Span className="--typing-dot" />
                        <Span className="--typing-dot" />
                        <Span className="--typing-dot" />
                    </Box>
                </Box>
            </Box>
        ];
    }, [renderedMessages, typing]);

    // Ensure first loaded messages still scroll to bottom even if the scroll node is mounted late.
    useEffect(() => {
        if (!autoScroll || hasInitialAutoScrolledRef.current || messages.length === 0) return;

        let cancelled = false;

        const ensureInitialScroll = () => {
            if (cancelled) return;
            const container = getScrollElement();
            if (!container) {
                requestAnimationFrame(ensureInitialScroll);
                return;
            }

            scrollToBottom(container);
            isAtBottomRef.current = true;
            setUnreadCount(0);
            setShouldShowUnread(false);
            hasInitialAutoScrolledRef.current = true;
        };

        ensureInitialScroll();

        return () => {
            cancelled = true;
        };
    }, [autoScroll, messages.length, getScrollElement, scrollToBottom]);

    // Auto-scroll on new messages while pinned to bottom.
    useEffect(() => {
        const container = getScrollElement();
        if (!container) return;

        const previousCount = lastMessageCountRef.current;
        const currentCount = messages.length;
        const newMessageCount = currentCount - previousCount;
        const pinnedToBottom = isAtBottomRef.current;

        lastMessageCountRef.current = currentCount;

        if (!hasMountedRef.current) {
            hasMountedRef.current = true;
            if (autoScroll) {
                scrollToBottom(container);
            }
            return;
        }

        if (newMessageCount > 0) {
            if (autoScroll && pinnedToBottom) {
                scrollToBottom(container);
                setUnreadCount(0);
                setShouldShowUnread(false);
            } else {
                setUnreadCount(prev => prev + newMessageCount);
                setShouldShowUnread(true);
            }
        }
    }, [messages, autoScroll, getScrollElement, scrollToBottom]);

    const handleScroll = useCallback(() => {
        const container = getScrollElement();
        if (!container) return;

        const bottom = isAtBottom(container);
        const isAtTop = container.scrollTop < 50;

        isAtBottomRef.current = bottom;
        setShouldShowUnread(!bottom);

        if (bottom) {
            setUnreadCount(0);
        }

        if (isAtTop) {
            if (!requestedTopRef.current) {
                requestedTopRef.current = true;
                onScrollTop?.();
            }
        } else {
            requestedTopRef.current = false;
        }
    }, [onScrollTop, getScrollElement, isAtBottom]);

    useEffect(() => {
        const container = getScrollElement();
        if (!container) return;

        container.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll, getScrollElement]);

    const handleScrollToBottom = useCallback(() => {
        const container = getScrollElement();
        if (container) {
            scrollToBottom(container);
            isAtBottomRef.current = true;
            setUnreadCount(0);
            setShouldShowUnread(false);
        }
    }, [getScrollElement, scrollToBottom]);

    return <Flex
        cols
        ref={shellRef}
        as={`rel --chatlist`}
        style={{
            width: `100%`,
            height: '100%',
            contain: 'layout style paint',
        }}
    >
        <ScrollView as={`h:full`} smooth>
            <List
                ref={listRef}
                items={listItems}
            />
        </ScrollView>
        
        {shouldShowUnread && (
            <Flex
                aic jcc
                as={`abs bottom:0 left:0 right:0`}
                style={{
                    padding: '12px',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)',
                }}
            >
                <Button
                    onClick={handleScrollToBottom}
                    style={{
                        padding: '8px 16px',
                        borderRadius: '20px',
                        fontSize: '12px',
                    }}
                >
                    <Text>{unreadCount > 0
                        ? `${unreadCount} new message${unreadCount !== 1 ? 's' : ''}`
                        : 'Go to bottom'}</Text>
                </Button>
            </Flex>
        )}
    </Flex>
}, (prevProps: ChatListProps, nextProps: ChatListProps) => {
    // Custom comparison for memo: only re-render if message count changes significantly
    // or if props other than messages change
    return (
        prevProps.messages.length === nextProps.messages.length &&
        prevProps.autoScroll === nextProps.autoScroll &&
        prevProps.smoothScroll === nextProps.smoothScroll &&
        prevProps.bottomThreshold === nextProps.bottomThreshold &&
        prevProps.onScrollTop === nextProps.onScrollTop &&
        prevProps.typing === nextProps.typing &&
        prevProps.locale === nextProps.locale &&
        prevProps.formatDateLabel === nextProps.formatDateLabel &&
        prevProps.dateLabels?.today === nextProps.dateLabels?.today &&
        prevProps.dateLabels?.yesterday === nextProps.dateLabels?.yesterday
    );
});

ChatList.displayName = 'Zuz.ChatList';

export default ChatList;