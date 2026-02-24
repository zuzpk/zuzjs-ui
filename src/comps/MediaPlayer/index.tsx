"use client"
import MediaPlayerBase from "./base";
import { Controls, Progress, Stage, TrackInfo, Volume } from "./parts";
import { MediaPlayerProps } from "./types";

/**
 * MediaPlayer Component
 * A compound component for building flexible audio/video interfaces.
 */
const MediaPlayerMain = ({ ref, ...props } : MediaPlayerProps) => {
    return <MediaPlayerBase {...props} ref={ref} />;
}
// --- Attach Sub-Components ---
// This allows the <MediaPlayer.Controls /> syntax
const MediaPlayer = Object.assign(MediaPlayerMain, {
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