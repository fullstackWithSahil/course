"use client";
import { Settings, Volume2, VolumeX, Rewind, FastForward } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

const Video = ({src, disabled = false}:{src: string, disabled?: boolean}) => {
  const resolutions = ["1080", "720", "360", "144"];
  const playbackSpeeds = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const [paused, setPaused] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [currentResolution, setCurrentResolution] = useState("1080");
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<any | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [showControls, setShowControls] = useState(true);
  const [lastTouchTime, setLastTouchTime] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Debug logging
  useEffect(() => {
    console.log("Video component mounted with src:", src);
    console.log("Current resolution:", currentResolution);
    console.log("Full video URL:", `${src}/${currentResolution}/index.m3u8`);
  }, [src, currentResolution]);

  // Handle volume changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Handle playback speed changes
  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  // Handle mobile touch events
  const handleTouchStart = useCallback(() => {
    setLastTouchTime(Date.now());
    setShowControls(true);
  }, []);

  const handleTouchEnd = useCallback(() => {
    const touchDuration = Date.now() - lastTouchTime;
    if (touchDuration < 200) {
      playPause();
    }
  }, [lastTouchTime]);

  // Auto-hide controls
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showControls && !paused) {
      timer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showControls, paused]);

  // Full-screen handling
  const toggleFullScreen = async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen();
        setIsFullScreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullScreen(false);
      }
    } catch (err) {
      console.error("Error attempting to toggle full-screen:", err);
    }
  };

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const inputEvents = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) {
        return;
      } else {
        if (e.key === " ") {
          e.preventDefault();
          playPause();
        } else if (e.key === "ArrowLeft") {
          skip(-10);
        } else if (e.key === "ArrowRight") {
          skip(10);
        } else if (e.key === "f") {
          toggleFullScreen();
        }
      }
    },
    [paused, disabled]
  );

  useEffect(() => {
    document.addEventListener("keydown", inputEvents);
    return () => {
      document.removeEventListener("keydown", inputEvents);
    };
  }, [inputEvents]);

  // Initial player setup
  useEffect(() => {
    if (!videoRef.current) return;

    console.log("Initializing Video.js player...");
    
    const videoUrl = `${src}/${currentResolution}/index.m3u8`;
    console.log("Video URL:", videoUrl);

    playerRef.current = videojs(videoRef.current, {
      controls: false,
      autoplay: false,
      preload: 'metadata',
      responsive: true,
      fluid: true,
      html5: {
        vhs: {
          overrideNative: true
        }
      },
      sources: [
        {
          src: videoUrl,
          type: "application/x-mpegURL",
        },
      ],
    });

    playerRef.current.ready(() => {
      console.log("Player is ready");
      setIsLoading(false);
    });

    playerRef.current.on("loadstart", () => {
      console.log("Video load started");
      setIsLoading(true);
      setVideoError(null);
    });

    playerRef.current.on("loadedmetadata", () => {
      console.log("Video metadata loaded");
      setDuration(playerRef.current.duration());
      playerRef.current.volume(volume);
      playerRef.current.playbackRate(playbackSpeed);
      setIsLoading(false);
    });

    playerRef.current.on("timeupdate", () => {
      setCurrentTime(playerRef.current.currentTime());
    });

    playerRef.current.on("error", (e: any) => {
      console.error("Video.js error:", e);
      const error = playerRef.current.error();
      if (error) {
        console.error("Error details:", error);
        setVideoError(`Video Error: ${error.message || 'Unknown error'}`);
      }
      setIsLoading(false);
    });

    playerRef.current.on("play", () => {
      console.log("Video started playing");
      setPaused(false);
    });

    playerRef.current.on("pause", () => {
      console.log("Video paused");
      setPaused(true);
    });

    return () => {
      if (playerRef.current) {
        console.log("Disposing Video.js player");
        playerRef.current.dispose();
      }
    };
  }, [src]);

  // Handle resolution changes
  useEffect(() => {
    if (!playerRef.current) return;
    
    const currentTime = playerRef.current.currentTime();
    const wasPlaying = !playerRef.current.paused();
    const currentVolume = playerRef.current.volume();
    const currentSpeed = playerRef.current.playbackRate();
    
    const newUrl = `${src}/${currentResolution}/index.m3u8`;
    console.log("Changing resolution to:", currentResolution, "URL:", newUrl);
    
    playerRef.current.src({
      src: newUrl,
      type: "application/x-mpegURL",
    });
  
    playerRef.current.one('loadedmetadata', () => {
      playerRef.current.currentTime(currentTime);
      playerRef.current.volume(currentVolume);
      playerRef.current.playbackRate(currentSpeed);
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  }, [currentResolution, src]);

  function playPause() {
    if (!playerRef.current) return;
    
    if (paused) {
      playerRef.current.play().catch((e: any) => {
        console.error("Play failed:", e);
        setVideoError("Failed to play video");
      });
    } else {
      playerRef.current.pause();
    }
  }

  function changeResolution(res: string) {
    if (!playerRef.current) return;
    
    const currentTime = playerRef.current.currentTime();
    const wasPlaying = !playerRef.current.paused();
    
    const newUrl = `${src}/${res}/index.m3u8`;
    console.log("Changing to resolution:", res, "URL:", newUrl);
    
    playerRef.current.src({
      src: newUrl,
      type: "application/x-mpegURL",
    });
    
    playerRef.current.one('loadedmetadata', () => {
      playerRef.current.currentTime(currentTime);
      playerRef.current.volume(isMuted ? 0 : volume);
      playerRef.current.playbackRate(playbackSpeed);
      if (wasPlaying) {
        playerRef.current.play();
      }
    });
  
    setCurrentResolution(res);
    setShowSettings(false);
  }

  function toggleMute() {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (playerRef.current) {
      playerRef.current.volume(newMutedState ? 0 : volume);
    }
  }

  function handleVolumeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (playerRef.current) {
      playerRef.current.volume(newVolume);
    }
  }

  function skip(seconds: number) {
    if (!playerRef.current) return;
    const newTime = playerRef.current.currentTime() + seconds;
    playerRef.current.currentTime(Math.max(0, Math.min(newTime, duration)));
  }

  function handleTimelineChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!playerRef.current) return;
    const newTime = parseFloat(e.target.value);
    playerRef.current.currentTime(newTime);
  }

  function formatTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }

  function handlePlaybackSpeedChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newSpeed = Number(e.target.value);
    setPlaybackSpeed(newSpeed);
    if (playerRef.current) {
      playerRef.current.playbackRate(newSpeed);
    }
  }

  // Show error state
  if (videoError) {
    return (
      <div className="relative mx-auto lg:w-full lg:max-w-[1000px] lg:aspect-video bg-black flex items-center justify-center">
        <div className="text-white text-center p-4">
          <p className="text-xl mb-2">⚠️ Video Error</p>
          <p className="text-sm">{videoError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      data-vjs-player
      className={`relative mx-auto bg-black ${
        isFullScreen
          ? "lg:w-screen lg:h-screen"
          : "lg:w-full lg:max-w-[1000px] lg:aspect-video"
      }`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseMove={() => setShowControls(true)}
    >
      <div className="group h-full relative">
        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
            <div className="text-white text-xl">Loading video...</div>
          </div>
        )}

        <video
          ref={videoRef}
          className="video-js vjs-big-play-centered w-full h-full"
          controls={false}
          data-setup='{"fluid": true}'
        />
        
        <div
          className={`absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 transition-opacity duration-300 ${
            showControls ? "opacity-100" : "opacity-0"
          } ${isFullScreen ? "pb-safe" : ""}`}
        >
          {/* Timeline */}
          <div className="px-4 w-full">
            <input
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              onChange={handleTimelineChange}
              className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center justify-between px-4 py-2 gap-2">
            <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-[200px]">
              <button onClick={playPause} className="mr-2 text-white">
                {paused ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="white" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24">
                    <path fill="white" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
                  </svg>
                )}
              </button>

              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={() => skip(-10)}>
                  <Rewind className="h-6 w-6 text-white" />
                </button>
                <button onClick={() => skip(10)}>
                  <FastForward className="h-6 w-6 text-white" />
                </button>
              </div>

              <span className="text-sm whitespace-nowrap text-white">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX className="h-6 w-6 text-white" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-white" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <select
                value={playbackSpeed}
                onChange={handlePlaybackSpeedChange}
                className="bg-transparent border-none outline-none cursor-pointer text-sm text-white"
              >
                {playbackSpeeds.map((speed) => (
                  <option key={speed} value={speed} className="text-black bg-gray-800">
                    {speed}x
                  </option>
                ))}
              </select>

              <div className="relative">
                <button onClick={() => setShowSettings((prev) => !prev)}>
                  <Settings className="h-6 w-6 text-white" />
                </button>
                {showSettings && (
                  <div className="absolute bottom-full right-0 mb-2 bg-black border border-gray-700 rounded-md p-2">
                    {resolutions.map((res) => (
                      <div
                        key={res}
                        className={`cursor-pointer px-2 py-1 ${
                          currentResolution === res ? "text-blue-500" : "text-white"
                        }`}
                        onClick={() => changeResolution(res)}
                      >
                        {res}p
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={toggleFullScreen}>
                {isFullScreen ? (
                  <svg viewBox="0 0 24 24" className="h-6 w-6">
                    <path
                      fill="white"
                      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
                    />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" className="h-6 w-6">
                    <path
                      fill="white"
                      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Video;