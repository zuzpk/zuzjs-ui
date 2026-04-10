import { timeSince } from "@zuzjs/core";
import { memo, Ref } from "react";
import { useBase } from "../../hooks";
import { BoxProps } from "../../types";
import Avatar from "../Avatar";
import Flex from "../Flex";
import Span from "../Span";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { BubbleProps, BubbleStatus } from "./types";

const Bubble = memo(({
    ref,
    ...props 
} : BubbleProps & {
    ref?: Ref<HTMLDivElement>;
}) => {

    const { 
        sender,
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

    const {
        className,
        style,
        rest
    } = useBase(pops);

    return <Flex
        gap={8}
        as={`--bubble-wrapper --bw-${side}`.trim()}
        ref={ref}>

        { sender && <Avatar 
            alt={sender.name} 
            src={sender.picture}
            style={{ backgroundColor: sender.color }}
        /> }
        
        <Flex
            cols
            ref={ref}
            className={[
                `--bubble --bubble-enter rel`, 
                media ? `--with-media --bma-${media.type}` : ``,
                `--bubble-${side}`, 
                `--bubble-style-${stylePreset}`, 
                arrow ? `` : `--bubble-grouped`,
                arrow === true ? `--b-arrow` : ``, 
                className
            ].filter(Boolean).join(" ").trim()}
            style={{
                ...style,
                contain: "layout style paint",
            }}
            {...rest as BoxProps}>
            
            {/* Name */}
            { sender && <Text className={`--bubble-name`}>{sender.name}</Text> }

            {/* Text Message */}
            { text && <Text className={`--bubble-text`}>{text}</Text> }

            {/* Bubble Stats */}
            <Flex aie jce as={`--bubble-stats`}>
                <Text className={`--bubble-stamp tar`}>{timeSince(timeStamp)}</Text>
                {side === "me" && <Span className={`--bubble-status --bs-${status}`}>
                    {status === BubbleStatus.Sending ? SVGIcons.pending
                        : status === BubbleStatus.Sent ? SVGIcons.done 
                        : status === BubbleStatus.Delivered ? SVGIcons.doneAll 
                        : SVGIcons.doneAll}
                </Span> }
            </Flex>

        </Flex>

    </Flex>
}, (prevProps, nextProps) => {
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
})

Bubble.displayName = `Zuz.Bubble`;

export default Bubble