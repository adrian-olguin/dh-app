import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Video } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { VideoPlayer } from "@/components/VideoPlayer";
import { useWatchVideos, WatchVideo } from "@/hooks/useWatchVideos";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

interface WatchTabProps {
  externalSelection?: { type: "video"; id: string } | null;
  onSelectionConsumed?: () => void;
}

export const WatchTab = ({ externalSelection, onSelectionConsumed }: WatchTabProps) => {
  const { t } = useTranslation();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const { featuredVideo, recentVideos, isLoading, error, refetch } = useWatchVideos();
  const [currentVideo, setCurrentVideo] = useState<WatchVideo | null>(null);

  const handlePlayVideo = (video: { id: string | number; title: string; thumbnail: string; videoUrl: string }) => {
    const url = video.videoUrl;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Web: open in new tab
      window.open(url, "_blank");
      // If you also run this in a native shell, you'd use Linking.openURL(url)
      return;
    }

    if (url.includes("vimeo.com")) {
      // Vimeo: open in new tab
      window.open(url, "_blank");
      return;
    }

    // Fallback: use internal HTML5 video player for direct .mp4 links
    setCurrentVideo({
      id: String(video.id),
      title: video.title,
      videoUrl: url,
      thumbnail: video.thumbnail,
      duration: "0:00",
    });
    setIsPlayerOpen(true);
  };

  useEffect(() => {
    if (externalSelection?.type === "video" && featuredVideo) {
      const allVideos = [featuredVideo, ...recentVideos];
      const target = allVideos.find((video) => video.id === externalSelection.id) || null;
      if (target) {
        handlePlayVideo(target);
        onSelectionConsumed?.();
      }
    }
  }, [externalSelection, featuredVideo, recentVideos, onSelectionConsumed]);

  if (error) {
    toast.error("Failed to load videos. Click retry to try again.");
  }

  if (isLoading) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
        {/* Featured Video Card Skeleton */}
        <Card className="mb-6 shadow-soft overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-20" />
            </div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-32 mb-6" />
            <Skeleton className="h-52 w-full mb-6 rounded-xl" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </Card>

        {/* Recent Videos Header Skeleton */}
        <div className="mb-3 flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
        </div>

        {/* Recent Video Cards Skeletons */}
        <div className="space-y-3">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="flex items-stretch gap-4 p-0">
                <Skeleton className="w-28 h-24 flex-shrink-0 rounded-none" />
                <div className="flex-1 py-4 pr-2 space-y-2">
                  <Skeleton className="h-5 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!featuredVideo && !isLoading) {
    return (
      <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground text-center">
            {t("watch.noVideos", "No videos available at this time.")}
          </p>
          <Button onClick={() => refetch()} variant="default">
            {t("watch.retryLoading", "Retry")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
      {/* Featured Video */}
      {featuredVideo && (
        <Card className="mb-6 shadow-soft overflow-hidden">
          <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/5 p-6">
            {/* Header Info */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-muted-foreground text-xs">
                <Calendar className="w-3.5 h-3.5" />
                <span>{featuredVideo.date}</span>
              </div>
              <div className="flex items-center gap-2 text-primary text-xs font-medium">
                <Video className="w-3.5 h-3.5" />
                <span>{t('watch.featured')}</span>
              </div>
            </div>
            
            {/* Title Section */}
            <h1 className="text-2xl font-bold text-foreground mb-1 leading-tight">{featuredVideo.title}</h1>
            <p className="text-sm text-muted-foreground mb-6">{t('watch.pastor')}</p>
            
            {/* Video Thumbnail */}
            <div className="relative rounded-xl overflow-hidden shadow-accent mb-6">
              <img
                src={featuredVideo.thumbnail}
                alt={featuredVideo.title}
                className="w-full h-52 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <Button
                size="lg"
                onClick={() => handlePlayVideo(featuredVideo)}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full w-20 h-20 bg-white hover:bg-white/95 shadow-glow transition-all hover:scale-110"
              >
                <Play className="w-10 h-10 fill-primary text-primary ml-1" />
              </Button>
              
              {/* Duration - Bottom Right */}
              <span className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full font-medium">
                {featuredVideo.duration}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <ShareButton
                title={featuredVideo.title}
                text={featuredVideo.description}
                label={t('watch.shareMessage')}
              />
            </div>
          </div>
        </Card>
      )}

      {/* Recent Videos */}
      {recentVideos.length > 0 && (
        <>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Play className="w-5 h-5 text-primary" />
              {t('watch.recentMessages')}
            </h2>
          </div>
          <div className="space-y-3">
            {recentVideos.map((video, index) => (
              <Card 
                key={video.id}
                onClick={() => handlePlayVideo(video)}
                className="hover:shadow-soft transition-all cursor-pointer border-2 border-transparent hover:border-accent/30 animate-slide-up overflow-hidden"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="flex items-stretch gap-4 p-0">
                  {/* Thumbnail Image */}
                  <div className="relative w-28 flex-shrink-0 rounded-l-lg overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                        <Play className="w-5 h-5 text-primary fill-primary ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {video.duration}
                    </span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 py-4 pr-2">
                    <p className="font-semibold text-foreground text-base mb-1 line-clamp-2">{video.title}</p>
                    <p className="text-xs text-muted-foreground">{t('watch.pastor')}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}

      {/* Video Player Modal */}
      {currentVideo && (
        <VideoPlayer
          isOpen={isPlayerOpen}
          onClose={() => setIsPlayerOpen(false)}
          videoUrl={currentVideo.videoUrl}
          title={currentVideo.title}
          thumbnail={currentVideo.thumbnail}
        />
      )}
    </div>
  );
};
