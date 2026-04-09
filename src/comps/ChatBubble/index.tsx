import { timeSince } from "@zuzjs/core";
import { forwardRef, memo, useMemo, useState, useEffect } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import Span from "../Span";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { BubbleAttachmentType, BubbleMediaType, BubbleProps, BubbleStatus } from "./types";
import { BoxProps } from "../../types";
import ProgressBar from "../ProgressBar";
import Image from "../Image";

interface LinkPreview {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

/**
 * ChatBubble component optimized for performance.
 * Supports:
 * - Complex nested content (reactions, replies, forwarded messages)
 * - Automatic link preview fetching and display
 * - Memoization for optimal rendering
 * - Media attachments (audio, image, video, documents)
 *
 * @example
 * // Basic usage
 * ```tsx
 * <ChatBubble text="Hello! How can I help?" side="me" />
 * ```
 *
 * @example
 * // With link preview auto-fetch
 * ```tsx
 * <ChatBubble text="Check this out: https://example.com" side="you" autoFetchLinkPreview />
 * ```
 */
const Bubble = memo(forwardRef<HTMLDivElement, BubbleProps>((props, ref) => {

    const { 
        text,
        media, 
        side = "me",
        stylePreset = "default",
        status = BubbleStatus.Sent,
        timeStamp = Date.now(), 
        arrow = true,
        attachments,
        autoFetchLinkPreview = false,
        linkPreviewFetcher,
        replyTo,
        reactions,
        forwarded,
        ...pops 
    } = props;

    const [linkPreview, setLinkPreview] = useState<LinkPreview | null>(null);
    const [loadingpreview, setLoadingPreview] = useState(false);

    const {
        className,
        style,
        rest
    } = useBase(pops);

    // Extract and fetch link preview
    const urlMatch = useMemo(() => {
        if (!text || !autoFetchLinkPreview) return null;
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        return text.match(urlRegex)?.[0];
    }, [text, autoFetchLinkPreview]);

    useEffect(() => {
        if (!urlMatch || !autoFetchLinkPreview) return;

        const controller = new AbortController();

        const fetchPreview = async () => {
            setLoadingPreview(true);
            try {
                if (linkPreviewFetcher) {
                    const data = await linkPreviewFetcher(urlMatch);
                    setLinkPreview(data || null);
                } else {
                    const response = await fetch(`https://r.jina.ai/http://${urlMatch.replace(/^https?:\/\//, "")}`, {
                        method: "GET",
                        signal: controller.signal,
                    });
                    if (response.ok) {
                        setLinkPreview({
                            title: urlMatch,
                            description: "Preview available",
                            url: urlMatch,
                        });
                    }
                }
            } catch (error) {
                if ((error as Error).name !== "AbortError") {
                    console.warn("Failed to fetch link preview:", error);
                }
            } finally {
                setLoadingPreview(false);
            }
        };

        // Debounce preview fetching
        const timeout = setTimeout(fetchPreview, 500);
        return () => {
            controller.abort();
            clearTimeout(timeout);
        };
    }, [urlMatch, autoFetchLinkPreview, linkPreviewFetcher]);

    // Memoize media rendering
    const renderedMedia = useMemo(() => {
        if (!media) return null;

        return media.type === BubbleMediaType.Audio ?
            <Box as={`flex aic --bubble-audio`}>
                <Span className={`--bm-action`}>{SVGIcons.play}</Span>
                <ProgressBar progress={0.7} />
                <Text className={`--bm-dur`}>{media.duration ?? `00:13`}</Text>
            </Box> 
            : media.type === BubbleMediaType.Image ?
            <Box as={`--bubble-image`}>
                <Image src={media.source} alt="Chat image" />
            </Box>
            : media.type === BubbleMediaType.Video ?
            <Box as={`--bubble-video`}>
                <video 
                    src={media.source} 
                    controls 
                    style={{ maxWidth: '200px', borderRadius: 'var(--bubble-radius)' }} 
                />
            </Box>
            : null;
    }, [media]);

    const renderedAttachments = useMemo(() => {
        if (!attachments || attachments.length === 0) return null;

        return <Box as={`--bubble-attachments flex cols gap:6 mt:8`}>
            {attachments.map((file, index) => {
                const key = file.id || `${file.name}-${index}`;
                const isImage = file.type === BubbleAttachmentType.Image || /\.(png|jpg|jpeg|webp|gif|svg)$/i.test(file.name);

                if (isImage && (file.preview || file.url)) {
                    return <Box key={key} as={`--bubble-attachment --att-image`}>
                        <Image src={file.preview || file.url} alt={file.name} />
                        <Box as={`--att-meta flex aic jbs`}>
                            <Text as={`s:xs bold`}>{file.name}</Text>
                            {file.size && <Text as={`s:xs dim-75`}>{file.size}</Text>}
                        </Box>
                    </Box>;
                }

                return <a
                    key={key}
                    className={`--bubble-attachment --att-file`}
                    href={file.url}
                    target="_blank"
                    rel="noreferrer"
                >
                    <Box as={`flex aic gap:8`}>
                        <Span className={`--att-icon`}>{SVGIcons.layers}</Span>
                        <Box as={`flex cols`}>
                            <Text as={`s:sm bold`}>{file.name}</Text>
                            {file.size && <Text as={`s:xs dim-75`}>{file.size}</Text>}
                        </Box>
                    </Box>
                </a>;
            })}
        </Box>;
    }, [attachments]);

    return <Box className={`--bubble-wrapper flex --bw-${side}`.trim()}>
        {/* Reply-to indicator */}
        {replyTo && (
            <Box as={`--bubble-reply-to pl:8 bl:2 opacity:0.7`} style={{ borderLeftColor: 'currentColor' }}>
                <Text as={`s:sm bold opacity:0.8`}>{replyTo.author}</Text>
                <Text as={`s:xs`}>{replyTo.text}</Text>
            </Box>
        )}

        {/* Forwarded indicator */}
        {forwarded && (
            <Text as={`s:xs opacity:0.7 italic`}>Forwarded</Text>
        )}

        <Box
            ref={ref}
            className={`--bubble --bubble-enter --bubble-${side} --bubble-style-${stylePreset} ${media ? `--with-media --bma-${media.type}` : ``} ${arrow ? `` : `--bubble-grouped`} rel flex cols ${arrow === true ? `--b-arrow` : ``} ${className}`.trim()}
            style={{
                ...style,
                contain: "layout style paint",
            }}
            {...rest as BoxProps}>
            
            {/* Text Message */}
            { text && <Text className={`--bubble-text`}>{text}</Text> }

            {/* Link Preview */}
            {linkPreview && !loadingpreview && (
                <Box 
                    as={`--bubble-link-preview mt:8 p:8 br:6 opacity:0.85`}
                    style={{
                        border: '1px solid currentColor',
                        borderRadius: '6px',
                        marginTop: '8px',
                        cursor: 'pointer',
                    }}
                    onClick={() => linkPreview.url && window.open(linkPreview.url, '_blank')}
                >
                    {linkPreview.image && (
                        <Image 
                            src={linkPreview.image} 
                            alt="Link preview"
                            style={{ maxWidth: '100%', borderRadius: '4px', marginBottom: '6px' }}
                        />
                    )}
                    {linkPreview.title && <Text as={`s:sm bold`}>{linkPreview.title}</Text>}
                    {linkPreview.description && <Text as={`s:xs`}>{linkPreview.description}</Text>}
                </Box>
            )}

            {/* Media Content */}
            {renderedMedia}

            {/* Attachments */}
            {renderedAttachments}

            {/* Reactions */}
            {reactions && reactions.length > 0 && (
                <Box as={`flex gap:4 mt:6`}>
                    {reactions.map((reaction, idx) => (
                        <Span key={idx} style={{ fontSize: '1.2em' }}>
                            {reaction}
                        </Span>
                    ))}
                </Box>
            )}

            {/* Bubble Stats */}
            <Box as={`flex aie jce --bubble-stats`}>
                <Text className={`--bubble-stamp tar`}>{timeSince(timeStamp)}</Text>
                {side === "me" && <Span className={`--bubble-status --bs-${status}`}>
                    {status === BubbleStatus.Sending ? SVGIcons.pending
                        : status === BubbleStatus.Sent ? SVGIcons.done 
                        : status === BubbleStatus.Delivered ? SVGIcons.doneAll 
                        : SVGIcons.doneAll}
                </Span> }
            </Box>
        </Box>

        {/* Reactions Selector (can be shown on hover) */}
        {/* Implementation would go here for interactive emoji reactions */}
    </Box>
}), (prevProps, nextProps) => {
    // Custom comparison: skip re-render if props haven't meaningfully changed
    return (
        prevProps.text === nextProps.text &&
        prevProps.side === nextProps.side &&
        prevProps.status === nextProps.status &&
        prevProps.timeStamp === nextProps.timeStamp &&
        prevProps.stylePreset === nextProps.stylePreset &&
        prevProps.media === nextProps.media &&
        prevProps.attachments === nextProps.attachments &&
        prevProps.reactions === nextProps.reactions
    );
});

Bubble.displayName = `Zuz.Bubble`;

export default Bubble;