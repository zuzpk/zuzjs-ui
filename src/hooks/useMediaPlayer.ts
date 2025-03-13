"use client"
import { useCallback, useRef, useState } from "react";

export type MediaType = "video" | "audio";

export type MediaPlayerProps = {
  src: string;
  type?: MediaType;
  autoPlay?: boolean;
  loop?: boolean;
  controls?: boolean;
};

const useMediaPlayer = ({ src, type = "video", autoPlay = false, loop = false, controls = false }: MediaPlayerProps) => {
    
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Play / Pause toggle
  const togglePlay = useCallback(() => {
    if (mediaRef.current) {
      if (mediaRef.current.paused) {
        mediaRef.current.play();
        setIsPlaying(true);
      } else {
        mediaRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, []);

  // Seek media
  const seek = useCallback((time: number) => {
    if (mediaRef.current) {
      mediaRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Change volume
  const changeVolume = useCallback((newVolume: number) => {
    if (mediaRef.current) {
      mediaRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  }, []);

  // Toggle fullscreen (only for video)
  const toggleFullscreen = useCallback(() => {
    if (type === "video" && mediaRef.current) {
      if (!document.fullscreenElement) {
        mediaRef.current.requestFullscreen?.();
        setIsFullscreen(true);
      } else {
        document.exitFullscreen?.();
        setIsFullscreen(false);
      }
    }
  }, [type]);

  // Update time
  const handleTimeUpdate = useCallback(() => {
    if (mediaRef.current) {
      setCurrentTime(mediaRef.current.currentTime);
    }
  }, []);

  // Set duration
  const handleLoadedMetadata = useCallback(() => {
    if (mediaRef.current) {
      setDuration(mediaRef.current.duration);
    }
  }, []);

  return {
    mediaRef,
    isPlaying,
    togglePlay,
    seek,
    volume,
    changeVolume,
    isFullscreen,
    toggleFullscreen,
    currentTime,
    duration,
    handleTimeUpdate,
    handleLoadedMetadata,
    mediaProps: {
      ref: mediaRef,
      src,
      autoPlay,
      loop,
      controls,
      onTimeUpdate: handleTimeUpdate,
      onLoadedMetadata: handleLoadedMetadata,
    },
  };
};

export default useMediaPlayer;