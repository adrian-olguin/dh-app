import { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, RotateCcw, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  thumbnail: string;
  episodeId: string;
  onEnded?: () => void;
  autoPlay?: boolean;
  onAutoPlayConsumed?: () => void;
}

export const AudioPlayer = ({ audioUrl, title, thumbnail, episodeId, onEnded, autoPlay = false, onAutoPlayConsumed }: AudioPlayerProps) => {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const autoplayAttempted = useRef(false);

  // Reset when episode or audioUrl changes
  useEffect(() => {
    autoplayAttempted.current = false;
    setIsLoading(true);
    setCurrentTime(0);
    setIsPlaying(false);
  }, [episodeId, audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      onEnded?.();
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioUrl, duration, episodeId, onEnded]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // Handle autoplay when autoPlay prop is true
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoPlay || isPlaying) return;

    // Reset autoplay attempt flag when audioUrl changes (handled by the reset effect above)
    
    // Function to attempt playback
    const attemptPlay = async () => {
      if (autoplayAttempted.current) return;
      autoplayAttempted.current = true;
      
      try {
        await audio.play();
        setIsPlaying(true);
        onAutoPlayConsumed?.();
      } catch (error) {
        console.error("Failed to autoplay audio:", error);
        onAutoPlayConsumed?.();
      }
    };

    // Check if audio is already ready to play
    if (audio.readyState >= 2) {
      // Audio has enough data, play immediately
      attemptPlay();
    } else {
      // Wait for audio to be ready - canplay fires when there's enough data to start playing
      const handleCanPlay = () => {
        attemptPlay();
      };
      
      // Use canplay event - fires when audio can start playing
      audio.addEventListener("canplay", handleCanPlay, { once: true });
      
      // Also try canplaythrough for better reliability (more data buffered)
      audio.addEventListener("canplaythrough", handleCanPlay, { once: true });
      
      return () => {
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("canplaythrough", handleCanPlay);
      };
    }
  }, [autoPlay, isPlaying, onAutoPlayConsumed, audioUrl]);

  const togglePlay = () => {
    if (audioRef.current && !isLoading) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    const newTime = value[0];
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(1);
      setIsMuted(false);
    } else {
      setVolume(0);
      setIsMuted(true);
    }
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const cyclePlaybackRate = () => {
    const rates = [1, 1.5, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Force reload when audioUrl changes and ensure it starts loading
  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      // Update src if it's different
      if (audio.src !== audioUrl) {
        audio.src = audioUrl;
      }
      // Force reload to start loading immediately
      audio.load();
    }
  }, [audioUrl]);

  return (
    <Card className="w-full bg-gradient-to-r from-primary/5 to-accent/5 border-2 border-primary/10">
      <CardContent className="p-4">
        <audio ref={audioRef} src={audioUrl} preload="auto" />
        
        {/* Episode Info */}
        <div className="flex items-center gap-3 mb-4">
          <img
            src={thumbnail}
            alt={title}
            className="w-16 h-16 rounded-lg object-cover shadow-md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm truncate">{title}</h4>
            <p className="text-xs text-muted-foreground">{t('listen.nowPlaying')}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2 mb-4">
          <Slider
            value={[currentTime]}
            max={duration || 100}
            step={1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

                {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Volume + slider */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="h-8 w-8"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <div className="w-20">
              <Slider
                value={[volume]}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
                className="cursor-pointer"
              />
            </div>
          </div>

          {/* Prev / Play / Next / Speed – all grouped tightly */}
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(-15)}
              className="h-9 w-9 relative flex items-center justify-center"
              title="Rewind 15 seconds"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="absolute top-0.5 right-0.5 text-[7px] font-bold text-primary leading-none">15</span>
            </Button>

            <Button
              onClick={togglePlay}
              size="lg"
              disabled={isLoading}
              className="h-11 w-11 rounded-full disabled:opacity-50"
            >
              {isPlaying ? (
                <Pause className="h-5 w-5 fill-current" />
              ) : (
                <Play className="h-5 w-5 fill-current ml-0.5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => skip(15)}
              className="h-9 w-9 relative flex items-center justify-center"
              title="Fast forward 15 seconds"
            >
              <RotateCw className="h-4 w-4" />
              <span className="absolute top-0.5 right-0.5 text-[7px] font-bold text-primary leading-none">15</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={cyclePlaybackRate}
              className="h-8 px-2 text-xs font-semibold min-w-[2.5rem]"
            >
              {playbackRate}x
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
