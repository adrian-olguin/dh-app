import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Headphones, Download } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { ShareButton } from "@/components/ShareButton";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Calendar as CalendarComponent } from "@/components/ui/calendar";
// import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useOfflineContent } from "@/hooks/useOfflineContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory } from "@capacitor/filesystem";

interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
  published_at: string;
  link: string;
}

interface PodcastResponse {
  id: string;
  title: string;
  description: string;
  duration: string;
  image_url: string;
  audio_url: string;
  published_at: string;
  link?: string;
}

interface ListenTabProps {
  externalSelection?: { type: "audio"; id: string } | null;
  onSelectionConsumed?: () => void;
}

export const ListenTab = ({ externalSelection, onSelectionConsumed }: ListenTabProps) => {
  const { t, i18n } = useTranslation();
  const { saveContent } = useOfflineContent();
  const [currentBroadcast, setCurrentBroadcast] = useState<Episode | null>(null);
  const [autoPlay, setAutoPlay] = useState(false); // 👈 NEW: request auto-play when user taps a tile
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [recentlyDownloadedIds, setRecentlyDownloadedIds] = useState<Set<string>>(new Set());
  const downloadIndicatorTimeouts = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const showDownloadedIndicator = (episodeId: string, durationMs = 4000) => {
    setRecentlyDownloadedIds((prev) => {
      const next = new Set(prev);
      next.add(episodeId);
      return next;
    });

    if (downloadIndicatorTimeouts.current[episodeId]) {
      clearTimeout(downloadIndicatorTimeouts.current[episodeId]);
    }

    downloadIndicatorTimeouts.current[episodeId] = setTimeout(() => {
      setRecentlyDownloadedIds((prev) => {
        const next = new Set(prev);
        next.delete(episodeId);
        return next;
      });
      delete downloadIndicatorTimeouts.current[episodeId];
    }, durationMs);
  };

  useEffect(() => {
    return () => {
      Object.values(downloadIndicatorTimeouts.current).forEach(clearTimeout);
    };
  }, []);

  const sanitizeFileName = (title: string) =>
    title.replace(/[^a-z0-9_-]+/gi, "_").replace(/_{2,}/g, "_").replace(/^_+|_+$/g, "").slice(0, 80) ||
    "daily-hope-audio";

  const blobToBase64 = (blob: Blob) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.includes(",") ? result.split(",")[1] : result;
        resolve(base64);
      };
      reader.readAsDataURL(blob);
    });

  const downloadAudioFile = async (episode: Episode) => {
    if (!episode.audioUrl) {
      toast.error("No audio file available to download");
      return;
    }

    const fileName = `${sanitizeFileName(episode.title)}.mp3`;
    const targetDirectory =
      Capacitor.getPlatform() === "android" ? Directory.ExternalStorage : Directory.Documents;
    const relativePath = `DailyHope/${fileName}`;

    const filesystemAvailable =
      Capacitor.isNativePlatform() &&
      typeof (Filesystem as any)?.writeFile === "function";

    let downloadCompleted = false;

    try {
      setDownloadingId(episode.id);

      if (filesystemAvailable) {
        let savedPath: string | null = null;

        try {
          const filesystemWithDownload = Filesystem as any;
          if (typeof filesystemWithDownload?.downloadFile === "function") {
            const result = await filesystemWithDownload.downloadFile({
              url: episode.audioUrl,
              directory: targetDirectory,
              path: relativePath,
              recursive: true,
            });
            savedPath = result?.path || result?.uri || null;
          }
        } catch (downloadError) {
          console.warn("downloadFile unsupported, falling back to writeFile", downloadError);
        }

        if (!savedPath) {
          const response = await fetch(episode.audioUrl);
          const blob = await response.blob();
          const base64Data = await blobToBase64(blob);
          const result = await Filesystem.writeFile({
            path: relativePath,
            data: base64Data,
            directory: targetDirectory,
            recursive: true,
            encoding: "base64",
          });
          savedPath = result?.uri || result?.path || null;
        }

        // Confirm file exists and surface final path
        try {
          const stat = await Filesystem.stat({
            path: relativePath,
            directory: targetDirectory,
          });
          savedPath = stat.uri || savedPath;
        } catch (statError) {
          console.warn("stat failed after download", statError);
        }

        if (!savedPath) {
          throw new Error("Download did not return a file path");
        }

        saveContent({
          id: episode.id,
          type: "audio",
          title: episode.title,
          date: episode.date,
          content: { ...episode, localPath: savedPath || undefined },
        });

        const locationHint =
          Capacitor.getPlatform() === "android"
            ? "Downloads/DailyHope"
            : "Files → On My iPhone → DailyHope";
        toast.success(`Audio saved (${locationHint})`);
        downloadCompleted = true;
      } else {
        if (Capacitor.isNativePlatform()) {
          toast.error("Download plugin unavailable. Rebuild after `npx cap sync`.");
        } else {
          const anchor = document.createElement("a");
          anchor.href = episode.audioUrl;
          anchor.download = fileName;
          anchor.target = "_blank";
          anchor.rel = "noopener";
          anchor.click();

          saveContent({
            id: episode.id,
            type: "audio",
            title: episode.title,
            date: episode.date,
            content: episode,
          });

          toast.success("Download started");
          downloadCompleted = true;
        }
      }
      if (downloadCompleted) {
        showDownloadedIndicator(episode.id);
      }
    } catch (error) {
      console.error("Error downloading audio", error);
      const message =
        error instanceof Error ? error.message : "Could not download audio";
      toast.error(message);
    } finally {
      setDownloadingId(null);
    }
  };

  const {
    data: episodes = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["podcast-episodes", i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "fetch-pastor-rick-content",
        {
          body: {
            type: "podcast",
            language: i18n.language,
          },
        }
      );

      if (error) throw error;
      if (!data?.success || !data?.podcasts) {
        throw new Error("Failed to fetch episodes");
      }

      // Transform podcasts to Episode format
      return (data.podcasts as PodcastResponse[]).map((podcast) => ({
        // Prefer canonical link as id so search + tab match
        id: podcast.link || podcast.published_at || podcast.id,
        title: podcast.title,
        description: podcast.description,
        date: new Date(podcast.published_at).toLocaleDateString(
          i18n.language === "es" ? "es-ES" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        duration: podcast.duration,
        thumbnail: podcast.image_url,
        audioUrl: podcast.audio_url,
        published_at: podcast.published_at,
        link: podcast.link || podcast.audio_url || "",
      })) as Episode[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Set the first episode as the current broadcast when episodes load,
  // but DO NOT start playback automatically – AudioPlayer stays paused.
  useEffect(() => {
    if (episodes.length > 0) {
      setCurrentBroadcast(episodes[0]);
      setAutoPlay(false); // ensure we don't accidentally auto-play on initial load
    } else {
      setCurrentBroadcast(null);
    }
  }, [episodes]);

  useEffect(() => {
    if (externalSelection?.type === "audio" && episodes.length > 0) {
      const target = episodes.find((episode) => episode.id === externalSelection.id);
      if (target) {
        setCurrentBroadcast(target);
        setAutoPlay(true);
        window.scrollTo(0, 0);
        onSelectionConsumed?.();
      }
    }
  }, [externalSelection, episodes, onSelectionConsumed]);

  if (error) {
    toast.error("Failed to load episodes. Click retry to try again.");
  }

  if (isLoading) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
        {/* Main Player Card Skeleton */}
        <Card className="mb-6 shadow-soft overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <div className="flex items-center gap-3">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-32 mb-6" />
            <Skeleton className="h-24 w-full mb-6 rounded-lg" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </Card>

        {/* Episode List Header Skeleton */}
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-9 w-28" />
        </div>

        {/* Episode Cards Skeletons */}
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="flex items-center gap-4 p-0">
                <Skeleton className="w-28 h-24 flex-shrink-0 rounded-none" />
                <div className="flex-1 py-4 pr-2 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="pr-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!currentBroadcast && !isLoading) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground text-center">
            {t("listen.noEpisodes")}
          </p>
          <Button onClick={() => refetch()} variant="default">
            {t("listen.retryLoading")}
          </Button>
        </div>
      </div>
    );
  }

  const isCurrentRecentlyDownloaded = currentBroadcast
    ? recentlyDownloadedIds.has(currentBroadcast.id)
    : false;
  const isCurrentDownloading = downloadingId === currentBroadcast?.id;

  return (
    <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
      {/* Unified Player Card */}
      <Card className="mb-6 shadow-soft overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
          {/* Header Info */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Calendar className="w-3.5 h-3.5" />
              <span>{currentBroadcast.date}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <Headphones className="w-3.5 h-3.5" />
                <span>{t("listen.title")}</span>
              </div>

              {/* Download Icon Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => downloadAudioFile(currentBroadcast)}
                      variant="ghost"
                      size="icon"
                      disabled={isCurrentDownloading || isCurrentRecentlyDownloaded}
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {isCurrentRecentlyDownloaded ? (
                        <Check className="w-4 h-4 animate-pulse" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isCurrentDownloading
                        ? "Downloading..."
                        : isCurrentRecentlyDownloaded
                          ? "Downloaded"
                          : "Download"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Title Section */}
          <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">
            {currentBroadcast.title}
          </h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <span>{t("listen.pastor")}</span>
          </div>
          {currentBroadcast.description && (
            <p className="text-sm text-muted-foreground mb-6">
              {currentBroadcast.description}
            </p>
          )}

          {/* Audio Player – mounted but paused until user presses Play OR taps a tile */}
          <div className="mb-6">
            <AudioPlayer
              audioUrl={currentBroadcast.audioUrl}
              title={currentBroadcast.title}
              thumbnail={currentBroadcast.thumbnail}
              episodeId={currentBroadcast.id}
              autoPlay={autoPlay}                    // 👈 tell player to auto-play after tile tap
              onAutoPlayConsumed={() => setAutoPlay(false)} // 👈 reset flag so it doesn't loop
            />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <ShareButton
              title={currentBroadcast.title}
              text={currentBroadcast.description}
              url={currentBroadcast.audioUrl || currentBroadcast.link}
              label={t("listen.shareMessage")}
            />
          </div>
        </div>
      </Card>

      {/* Episode List */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          {t("listen.recentEpisodes")}
        </h2>
      </div>

      <div className="space-y-3">
        {episodes.slice(1, 61).map((episode, index) => {
          const isEpisodeDownloading = downloadingId === episode.id;
          const isEpisodeRecentlyDownloaded = recentlyDownloadedIds.has(episode.id);

          return (
            <Card
              key={episode.id}
              className={cn(
                "hover:shadow-soft transition-all border-2 animate-slide-up overflow-hidden",
                currentBroadcast?.id === episode.id
                  ? "border-primary"
                  : "border-transparent hover:border-accent/30"
              )}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="flex items-stretch gap-2 p-0 relative">
                {/* Thumbnail Image */}
                <div className="relative w-28 flex-shrink-0 rounded-l-lg overflow-hidden">
                  <img
                    src={episode.thumbnail}
                    alt={episode.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Play button: autoplay without scrolling
                        setCurrentBroadcast(episode);
                        setAutoPlay(true);
                      }}
                      className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer"
                    >
                      <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="flex-1 py-3 pr-1 cursor-pointer"
                  onClick={() => {
                    // Content area: scroll to top without autoplaying
                    setCurrentBroadcast(episode);
                    setAutoPlay(false);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-foreground text-base line-clamp-2 flex-1">
                      {episode.title}
                    </p>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1 line-clamp-2">
                    {episode.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      {episode.date}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <div className="pr-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          disabled={isEpisodeDownloading || isEpisodeRecentlyDownloaded}
                          onClick={async (e) => {
                            e.stopPropagation();
                            await downloadAudioFile(episode);
                          }}
                        >
                          {isEpisodeRecentlyDownloaded ? (
                            <Check className="w-4 h-4 text-primary animate-pulse" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {isEpisodeDownloading
                            ? "Downloading..."
                            : isEpisodeRecentlyDownloaded
                              ? "Downloaded"
                              : "Download"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
