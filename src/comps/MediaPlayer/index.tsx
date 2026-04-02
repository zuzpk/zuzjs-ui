"use client"
import MediaPlayerBase from "./base";
import { Controls, Progress, Stage, TrackInfo, Volume } from "./parts";

/**
 * MediaPlayer component.
 *
 * @example
 * // Basic usage
 * ```tsx
 * <MediaPlayer src="https://example.com/video.mp4" type="video" />
 * ```
 *
 * @example
 * // Advanced usage with additional props
 * ```tsx
 * <MediaPlayer src="https://example.com/video.mp4" type="video" controls autoplay={false} width="100%" />
 * ```
 * @param src - Source URL
 * @param type - Component or input type
 * @param controls - controls prop
 * @param autoplay - Whether carousel autoplays
 * @param width - width prop
 */
const MediaPlayer = Object.assign(MediaPlayerBase, {
    Stage,
    TrackInfo,
    Controls,
    Progress,
    Volume,
});

// const MediaPlayer = ({
//     ref,
//     ...props
// } : MediaPlayerProps ) => {


// }

export default MediaPlayer