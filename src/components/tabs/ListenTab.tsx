import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Calendar, Headphones, CalendarIcon, Download, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { ShareButton } from "@/components/ShareButton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useOfflineContent } from "@/hooks/useOfflineContent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { AudioPlayer } from "@/components/AudioPlayer";
import { useTranslation } from "react-i18next";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlaybackPositions } from "@/hooks/usePlaybackPosition";
import { useAuth } from "@/contexts/AuthContext";

interface Episode {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  thumbnail: string;
  audioUrl: string;
  published_at: string;
}

export const ListenTab = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { saveContent, isContentSaved } = useOfflineContent();
  const [currentBroadcast, setCurrentBroadcast] = useState<Episode | null>(null);
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const { getPositions } = usePlaybackPositions();
  const [playbackPositions, setPlaybackPositions] = useState<Map<string, any>>(new Map());

  const { data: episodes = [], isLoading, error, refetch } = useQuery({
    queryKey: ['podcast-episodes', i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('fetch-pastor-rick-content', {
        body: { 
          type: 'podcast',
          language: i18n.language 
        }
      });
      
      if (error) throw error;
      if (!data?.success || !data?.podcasts) {
        throw new Error('Failed to fetch episodes');
      }
      
      // Transform podcasts to Episode format
      return data.podcasts.map((podcast: any) => ({
        id: podcast.id,
        title: podcast.title,
        description: podcast.description,
        date: new Date(podcast.published_at).toLocaleDateString(i18n.language === 'es' ? 'es-ES' : 'en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }),
        duration: podcast.duration,
        thumbnail: podcast.image_url,
        audioUrl: podcast.audio_url,
        published_at: podcast.published_at,
      })) as Episode[];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // Always set the first episode as current whenever the list changes
  useEffect(() => {
    if (episodes.length > 0) {
      setCurrentBroadcast(episodes[0]);
      setSelectedEpisode(episodes[0]);
    } else {
      setCurrentBroadcast(null);
      setSelectedEpisode(null);
    }
  }, [episodes]);


  // Load playback positions when episodes are loaded
  useEffect(() => {
    if (episodes.length > 0 && user) {
      getPositions().then(setPlaybackPositions);
    }
  }, [episodes, user, getPositions]);

  if (error) {
    toast.error('Failed to load episodes. Click retry to try again.');
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
          <p className="text-muted-foreground text-center">{t('listen.noEpisodes')}</p>
          <Button onClick={() => refetch()} variant="default">
            {t('listen.retryLoading')}
          </Button>
        </div>
      </div>
    );
  }

  const isSaved = isContentSaved(currentBroadcast.id);
  const currentPosition = playbackPositions.get(currentBroadcast.id);
  const currentProgress = currentPosition && currentPosition.duration > 0 
    ? (currentPosition.position / currentPosition.duration) * 100 
    : 0;
  const isCurrentCompleted = currentPosition?.completed || false;

  const handleDownload = () => {
    saveContent({
      id: currentBroadcast.id,
      type: "audio",
      title: currentBroadcast.title,
      date: currentBroadcast.date,
      content: currentBroadcast,
    });
  };

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
              {currentProgress > 0 && !isCurrentCompleted && (
                <span className="text-primary font-medium ml-1">• {Math.round(currentProgress)}%</span>
              )}
              {isCurrentCompleted && (
                <span className="flex items-center gap-1 text-primary font-medium ml-1">
                  • <Check className="w-3 h-3" /> Completed
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <Headphones className="w-3.5 h-3.5" />
                <span>{t('listen.title')}</span>
              </div>
              
              {/* Download Icon Button */}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={handleDownload}
                      variant="ghost"
                      size="icon"
                      disabled={isSaved}
                      className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10"
                    >
                      {isSaved ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSaved ? "Downloaded" : "Download"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          {/* Title Section */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground mb-1 leading-tight">{currentBroadcast.title}</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{t('listen.pastor')}</span>
              {currentProgress > 0 && !isCurrentCompleted && (
                <span className="text-primary font-medium">• Continue playing</span>
              )}
            </div>
          </div>
          
          {/* Audio Player */}
          {selectedEpisode && (
            <div className="mb-6">
              <AudioPlayer
                audioUrl={selectedEpisode.audioUrl}
                title={selectedEpisode.title}
                thumbnail={selectedEpisode.thumbnail}
                episodeId={selectedEpisode.id}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <ShareButton
              title={currentBroadcast.title}
              text={currentBroadcast.description}
              label={t('listen.shareMessage')}
            />
          </div>
        </div>
      </Card>

      {/* Episode List */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          {t('listen.recentEpisodes')}
        </h2>
        {/* <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-9 gap-2",
                selectedDate && "text-primary"
              )}
            >
              <CalendarIcon className="w-4 h-4" />
              {selectedDate ? format(selectedDate, "MMM d") : t('listen.selectDate')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover> */}
      </div>
      <div className="space-y-3">
        {episodes.slice(1, 7).map((episode, index) => {
          const position = playbackPositions.get(episode.id);
          const progress = position && position.duration > 0 
            ? (position.position / position.duration) * 100 
            : 0;
          const isCompleted = position?.completed || false;
          
          return (
          <Card 
            key={episode.id} 
            onClick={() => {
              setSelectedEpisode(episode);
              setCurrentBroadcast(episode);
            }}
            className={cn(
              "hover:shadow-soft transition-all cursor-pointer border-2 animate-slide-up overflow-hidden",
              selectedEpisode?.id === episode.id ? "border-primary" : "border-transparent hover:border-accent/30"
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="flex items-center gap-4 p-0 relative">
              {/* Progress bar at bottom */}
              {progress > 0 && !isCompleted && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                  <div 
                    className="h-full bg-primary transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {/* Thumbnail Image */}
              <div className="relative w-28 h-24 flex-shrink-0">
                <img
                  src={episode.thumbnail}
                  alt={episode.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <Headphones className="w-5 h-5 text-primary" />
                  </div>
                </div>
                <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  {episode.duration}
                </span>
              </div>
              
              {/* Content */}
              <div className="flex-1 py-4 pr-2">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground text-base line-clamp-2 flex-1">{episode.title}</p>
                  {isCompleted && (
                    <Check className="w-4 h-4 text-primary flex-shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-1">{t('listen.pastor')}</p>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-muted-foreground">{episode.date}</p>
                  {progress > 0 && !isCompleted && (
                    <p className="text-xs text-primary font-medium">{Math.round(progress)}%</p>
                  )}
                </div>
              </div>

              {/* Download Button */}
              <div className="pr-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          saveContent({
                            id: episode.id,
                            type: "audio",
                            title: episode.title,
                            date: episode.date,
                            content: episode,
                          });
                        }}
                      >
                        {isContentSaved(episode.id) ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isContentSaved(episode.id) ? "Downloaded" : "Download"}</p>
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
