import { timeSince } from "@zuzjs/core";
import { forwardRef } from "react";
import { Image, ProgressBar } from "../..";
import { useBase } from "../../hooks";
import Box, { BoxProps } from "../Box";
import Span from "../Span";
import SVGIcons from "../svgicons";
import Text from "../Text";
import { BubbleMediaType, BubbleProps, BubbleStatus } from "./types";

const Bubble = forwardRef<HTMLDivElement, BubbleProps>((props, ref) => {

    const { 
        text,
        media, 
        side = "me",
        status = BubbleStatus.Sent,
        timeStamp = Date.now(), 
        arrow = true,
        ...pops 
    } = props

    const {
        className,
        style,
        rest
    } = useBase(pops)

    return <Box className={`--bubble-wrapper flex --bw-${side}`.trim()}>
        <Box
            className={`--bubble --bubble-${side} ${media ? `--with-media --bma-${media.type}` : ``} rel flex cols ${arrow == true ? `--b-arrow` : ``} ${className}`.trim()}
            style={{
                ...style,
            }}
            {...rest as BoxProps}>
            
            {/* Text Message */}
            { text &&  <Text className={`--bubble-text`}>{text}</Text> }

            {/* Audio */}
            { media ?
                media.type == BubbleMediaType.Audio ?
                    <Box as={`flex aic --bubble-audio`}>
                            <Span className={`--bm-action`}>{SVGIcons.play}</Span>
                            <ProgressBar progress={0.7} />
                            <Text className={`--bm-dur`}>{media.duration ?? `00:13`}</Text>
                    </Box> 
                    : media.type == BubbleMediaType.Image ?
                    <Box as={`--bubble-image`}>
                        <Image src={media.source} />
                    </Box>
                    : null : null }

            <Box as={`flex aie jce --bubble-stats`}>
                <Text className={`--bubble-stamp tar`}>{timeSince(timeStamp)}</Text>
                {side == "me" && <Span className={`--bubble-status --bs-${status}`}>{status == BubbleStatus.Sending ? SVGIcons.pending
                    : status == BubbleStatus.Sent ? SVGIcons.done 
                    : status == BubbleStatus.Delivered ? SVGIcons.doneAll : SVGIcons.doneAll}</Span> }
            </Box>
        </Box>
    </Box>
});

Bubble.displayName = `Zuz.Bubble`

export default Bubble