import { MediaItem, useMediaPlayer } from "@zuzjs/hooks";
import { ReactNode, Ref } from "react";
import { BoxProps } from "../../types";

export interface MediaPlayerController {

}

export type MediaPlayerProps = Omit<BoxProps, `ref`> & {
    ref?: Ref<MediaPlayerController>,
    playlist?: MediaItem[];
    mode?: 'audio' | 'video';
    autoPlay?: boolean;
    icons?: MediaPlayerIcons;
    defaultTitle?: string;
    defaultCover?: string;
    defaultArtist?: string;
    onTrackChange?: (item: MediaItem) => void;
}

type MediaPlayerIcon = string | ReactNode;

export interface MediaPlayerIcons {
    play?: MediaPlayerIcon;
    pause?: MediaPlayerIcon;
    prev?: MediaPlayerIcon;
    next?: MediaPlayerIcon;
    volumeHigh?: MediaPlayerIcon;
    volumeMute?: MediaPlayerIcon;
    loading?: MediaPlayerIcon;
}

export type MediaPlayerContextType = ReturnType<typeof useMediaPlayer> & {
    icons?: MediaPlayerIcons;
    mode?: "audio" | "video";
    defaultTitle?: string;
    defaultCover?: string;
    defaultArtist?: string;
};