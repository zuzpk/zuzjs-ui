import { memo, useMemo, useRef, useEffect, useState, useCallback } from "react";
import { ChatBubble } from "..";
import List from "../List";
import Box from "../Box";
import Button from "../Button";
import Text from "../Text";
import ScrollView from "../ScrollView";
import Span from "../Span";
import { ListItem } from "../List/types";
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
    onScrollTop,
    typing,
    dateLabels,
    locale,
    formatDateLabel,
}: ChatListProps) => {
    const shellRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement | HTMLOListElement>(null);
    const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isUserScrollingRef = useRef(false);
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
                    <Box key={`date-${currentDateMeta.key}-${i}`} as={`flex aic jcc p:8,0`}>
                        <Text as={`s:xs dim-50`}>{currentDateMeta.label}</Text>
                    </Box>
                );
            }

            rows.push(
                <ChatBubble
                    key={m.id || i}
                    {...m}
                    arrow={m.arrow ?? showArrow}
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

    // Auto-scroll to bottom when new messages arrive (unless user scrolled up)
    useEffect(() => {
        const container = getScrollElement();
        if (!container || !autoScroll) return;

        // Check if new messages arrived
        const newMessageCount = messages.length - lastMessageCountRef.current;
        if (newMessageCount > 0) {
            lastMessageCountRef.current = messages.length;

            // Auto-scroll only if user wasn't manually scrolling
            if (!isUserScrollingRef.current) {
                // Use requestAnimationFrame for smooth scrolling
                requestAnimationFrame(() => {
                    container.scrollTop = container.scrollHeight;
                });
                setUnreadCount(0);
                setShouldShowUnread(false);
            } else {
                // User is scrolled up, show unread count
                setUnreadCount(prev => prev + newMessageCount);
                setShouldShowUnread(true);
            }
        }
    }, [messages, autoScroll, getScrollElement]);

    // Track manual scrolling
    const handleScroll = useCallback(() => {
        const container = getScrollElement();
        if (!container) return;

        const isAtBottom = 
            container.scrollHeight - container.scrollTop - container.clientHeight < 100;
        
        const isAtTop = container.scrollTop < 50;

        // Update scrolling state
        isUserScrollingRef.current = !isAtBottom;
        setShouldShowUnread(!isAtBottom);

        // Reset unread when user scrolls to bottom
        if (isAtBottom) {
            setUnreadCount(0);
            setShouldShowUnread(false);
        }

        // Call scroll top callback if user scrolls to top
        if (isAtTop) {
            if (!requestedTopRef.current) {
                requestedTopRef.current = true;
                onScrollTop?.();
            }
        } else {
            requestedTopRef.current = false;
        }

        // Clear previous timeout
        if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current);
        }

        // Debounce scroll event handling
        scrollTimeoutRef.current = setTimeout(() => {
            isUserScrollingRef.current = false;
        }, 500);
    }, [onScrollTop, getScrollElement]);

    useEffect(() => {
        const container = getScrollElement();
        if (!container) return;

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll, getScrollElement]);

    // Handle scroll to bottom when unread indicator is clicked
    const handleScrollToBottom = useCallback(() => {
        const container = getScrollElement();
        if (container) {
            container.scrollTop = container.scrollHeight;
            setUnreadCount(0);
            setShouldShowUnread(false);
        }
    }, [getScrollElement]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scrollTimeoutRef.current) {
                clearTimeout(scrollTimeoutRef.current);
            }
        };
    }, []);

    return <Box
        ref={shellRef}
        as={`rel flex cols`}
        style={{
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
        
        {/* Unread Messages Indicator */}
        {shouldShowUnread && unreadCount > 0 && (
            <Box 
                as={`abs bottom:0 left:0 right:0 flex aic jcc`}
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
                    <Text>{unreadCount} new message{unreadCount !== 1 ? 's' : ''}</Text>
                </Button>
            </Box>
        )}
    </Box>
}, (prevProps: ChatListProps, nextProps: ChatListProps) => {
    // Custom comparison for memo: only re-render if message count changes significantly
    // or if props other than messages change
    return (
        prevProps.messages.length === nextProps.messages.length &&
        prevProps.autoScroll === nextProps.autoScroll &&
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