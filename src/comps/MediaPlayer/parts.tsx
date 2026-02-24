import { ReactNode } from "react";
import Box from "../Box";
import Button from "../Button";
import Icon from "../Icon";
import Image from "../Image";
import Slider from "../Slider";
import Spinner from "../Spinner";
import SVGIcons from "../svgicons";
import { useMediaPlayerContext } from "./base";

const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const makeIcon = (ico: string | ReactNode) => {
    return `string` === typeof ico ? <Icon name={ico} />
        : ico
}

// STAGE (Video/Cover Art)
export const Stage = () => {
    const { mediaRef, state, controls, mode } = useMediaPlayerContext();
    
    return (
        <Box as={`--mediaplayer-stage rel --mode-${mode}`}>
            {/* Render video only if mode is video, else keep audio hidden */}
            {mode === 'video' ? (
                <video ref={mediaRef as any} className="fill" onClick={controls.togglePlay} />
            ) : (
                <audio ref={mediaRef as any} />
            )}
            
            {state.isLoading && (
                <Box as="abs fill aic jcc --mediaplayer-spinner">
                    <Spinner />
                </Box>
            )}
        </Box>
    );
};

// --- TRACK INFO ---
export const TrackInfo = () => {
    const { state, defaultArtist, defaultTitle, defaultCover } = useMediaPlayerContext();
    
    return (
        <Box as="--track-info flex aic">
            <Image src={state.currentItem?.cover || defaultCover || ``} as="--track-cover" />
            <Box as="flex cols">
                <Box as="--track-title">{state.currentItem?.title || defaultTitle || `Choose Track`}</Box>
                <Box as="--track-artist">{state.currentItem?.artist || defaultArtist || `...`}</Box>
            </Box>
        </Box>
    );
};

// --- CONTROLS ---
export const Controls = () => {
    const { state, controls, icons } = useMediaPlayerContext();
    return (
        <Box as="--mediaplayer-controls flex aic">
            <Button onClick={controls.prev} as="--prev">{makeIcon(icons?.prev ?? SVGIcons.prev)}</Button>
            <Button onClick={controls.togglePlay} as="--play-pause">
                {makeIcon(state.isPlaying ? icons?.pause ?? SVGIcons.pause : icons?.play ?? SVGIcons.play)}
            </Button>
            <Button onClick={controls.next} as="--next">{makeIcon(icons?.next ?? SVGIcons.next)}</Button>
        </Box>
    );
};



// --- PROGRESS BAR ---
export const Progress = () => {
    const { state, controls, mediaRef } = useMediaPlayerContext();
    
    // Calculate current time in seconds for display
    const currentTime = (state.progress * (state.duration || 0));

    return (
        <Box as="--track-progress flex aic">
            <Box as="--track-current-duration">{formatTime(currentTime)}</Box>
            <Slider
                value={state.progress} 
                onClick={(e: any) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const percent = (e.clientX - rect.left) / rect.width;
                    controls.seek(percent);
                }} 
            />
            <Box as="--track-total-duration">{formatTime(state.duration)}</Box>
        </Box>
    );
};

// --- VOLUME ---
export const Volume = () => {
    const { state, controls, icons } = useMediaPlayerContext();
    return (
        <Box as="--volume-control flex aic gap:8 w:120">
            <Button onClick={() => controls.setIsMuted()}>
                {makeIcon(state.isMuted ? icons?.volumeMute ?? SVGIcons.volumeMute : icons?.volumeHigh ?? SVGIcons.volumeHigh)}
            </Button>
            <Slider 
                value={state.volume} 
                className="h:3 flex:1"
                onClick={(e: any) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    controls.setVolume((e.clientX - rect.left) / rect.width);
                }}
            />
        </Box>
    );
};