"use client"
import { useMediaPlayer } from "@zuzjs/hooks";
import { createContext, useContext, useMemo } from "react";
import { useBase } from "../../hooks";
import Box from "../Box";
import SVGIcons from "../svgicons";
import { MediaPlayerContextType, MediaPlayerProps } from "./types";

const MediaPlayerContext = createContext<MediaPlayerContextType | null>(null);

export const useMediaPlayerContext = () => {
    const context = useContext(MediaPlayerContext);
    if (!context) throw new Error("MediaPlayer sub-components must be used within <MediaPlayer />");
    return context;
};

const MediaPlayerBase = ({
    ref,
    icons: customIcons,
    children,
    ...props
} : MediaPlayerProps ) => {

    const { 
        playlist = [], 
        mode = 'audio', 
        defaultArtist = `Artist`,
        defaultTitle = `No Track`,
        defaultCover,
        onTrackChange, 
        ...pops 
    } = props;

    const { className, style, rest } = useBase(pops);
    const player = useMediaPlayer(playlist, playlist[0] ?? undefined);

    // Merge custom icons with defaults so we always have something to render
    const icons = useMemo(() => ({
        play: SVGIcons.play,
        pause: SVGIcons.pause,
        prev: SVGIcons.prev,
        next: SVGIcons.next,
        volumeHigh: SVGIcons.volumeHigh,
        volumeMute: SVGIcons.volumeMute,
        ...customIcons
    }), [customIcons]);

    // Provide both the player logic AND the icons to the context
    const value = useMemo(() => ({
        ...player,
        mode,
        icons
    }), [player, icons]);


    return <MediaPlayerContext.Provider value={value}>
        <Box className={`--zuz-media-player ${className}`} style={style}>
            {children}
        </Box>
    </MediaPlayerContext.Provider>

}

export default MediaPlayerBase