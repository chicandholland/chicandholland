"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";

interface HlsVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  fallbackSrc?: string;
  startLevel?: number; // -1 for auto, 0 for lowest, 1+ for specific quality
  maxBufferLength?: number;
  lowLatencyMode?: boolean;
}

export default function HlsVideo({
  src,
  fallbackSrc,
  startLevel = -1,
  maxBufferLength = 60,
  lowLatencyMode = true,
  ...videoProps
}: HlsVideoProps) {
  const {
    className = "",
    autoPlay = false,
    muted = false,
    loop = false,
    playsInline = false,
    controls = false,
    poster,
    preload = "metadata",
    controlsList,
    style,
    ...restProps
  } = videoProps;
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const initializeHls = () => {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode,
          backBufferLength: 90,
          startLevel,
          maxBufferLength,
          maxMaxBufferLength: maxBufferLength * 2,
          xhrSetup: (xhr, url) => {
            xhr.withCredentials = false;
          },
        });

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setIsLoading(false);
          if (autoPlay) {
            video.play().catch(console.error);
          }
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS Error:", data);
          if (data.fatal) {
            console.log("HLS failed, falling back to MP4");
            if (fallbackSrc) {
              setUseFallback(true);
              setError(null);
            } else {
              setError("Failed to load video");
            }
            setIsLoading(false);
          }
        });

        hlsRef.current = hls;
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        // Native HLS support (Safari)
        video.src = src;
        video.addEventListener('error', () => {
          if (fallbackSrc) {
            setUseFallback(true);
          } else {
            setError("Failed to load video");
          }
          setIsLoading(false);
        });
        video.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          if (autoPlay) {
            video.play().catch(console.error);
          }
        });
      } else {
        console.log("HLS not supported, using fallback");
        if (fallbackSrc) {
          setUseFallback(true);
        } else {
          setError("HLS not supported");
        }
        setIsLoading(false);
      }
    };

    if (!useFallback) {
      initializeHls();
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [src, autoPlay, fallbackSrc, useFallback, startLevel, maxBufferLength, lowLatencyMode]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-200 ${className}`}>
        <p className="text-gray-500">Error loading video</p>
      </div>
    );
  }

  if (useFallback && fallbackSrc) {
    return (
      <video
        {...restProps}
        className={className}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        playsInline={playsInline}
        controls={controls}
        poster={poster}
        preload={preload}
        controlsList={controlsList}
        style={style}
        src={fallbackSrc}
        onLoadedMetadata={() => setIsLoading(false)}
      />
    );
  }

  return (
    <video
      {...restProps}
      ref={videoRef}
      className={className}
      autoPlay={autoPlay}
      muted={muted}
      loop={loop}
      playsInline={playsInline}
      controls={controls}
      poster={poster}
      preload={preload}
      controlsList={controlsList}
      style={style}
    />
  );
}