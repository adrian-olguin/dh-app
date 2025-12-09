import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Calendar, Video, CalendarIcon, Download, Check } from "lucide-react";
import { ShareButton } from "@/components/ShareButton";
import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es, pt } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useOfflineContent } from "@/hooks/useOfflineContent";
import { useTranslation } from "react-i18next";
import { VideoPlayer } from "@/components/VideoPlayer";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import natureFeatured from "@/assets/nature-featured.jpg";
import tvThumbnail from "@/assets/TV-thumbnail.jpg"

export const WatchTab = () => {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const { saveContent, isContentSaved } = useOfflineContent();
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{
    id: string;
    title: string;
    videoUrl: string;
    thumbnail: string;
  } | null>(null);
  
  const getLocale = () => {
    switch (i18n.language) {
      case 'es':
        return es;
      case 'pt':
        return pt;
      default:
        return undefined;
    }
  };

  const videoDate = new Date(2025, 12, 8); // December 8, 2025
  
  const featuredVideo = {
    id: "video-2025-11-09",
    date: format(videoDate, "MMMM d, yyyy", { locale: getLocale() }),
    title: t('watch.featuredTitle'),
    description: t('watch.featuredDescription'),
    thumbnail: tvThumbnail,
    duration: "28:45",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
  };

  const recentVideos = [
    { 
      id: 1, 
      title: t('watch.videos.powerOfFaith'), 
      duration: "24:30",
      thumbnail: tvThumbnail,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    { 
      id: 2, 
      title: t('watch.videos.livingWithPurpose'), 
      duration: "31:15",
      thumbnail: tvThumbnail,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },
    { 
      id: 3, 
      title: t('watch.videos.overcomingChallenges'), 
      duration: "26:50",
      thumbnail: tvThumbnail,
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    },
    { 
      id: 4, 
      title: t('watch.videos.walkingInLove'), 
      duration: "29:10",
      thumbnail: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4"
    },
    { 
      id: 5, 
      title: t('watch.videos.godsGrace'), 
      duration: "27:35",
      thumbnail: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4"
    },
    { 
      id: 6, 
      title: t('watch.videos.buildingRelationships'), 
      duration: "32:20",
      thumbnail: "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=400&q=80",
      videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
    },
  ];

  const isSaved = isContentSaved(featuredVideo.id);

  const handleDownload = () => {
    saveContent({
      id: featuredVideo.id,
      type: "video",
      title: featuredVideo.title,
      date: featuredVideo.date,
      content: featuredVideo,
    });
  };

  const handlePlayVideo = (video: { id: string | number; title: string; thumbnail: string; videoUrl: string }) => {
    const url = video.videoUrl;

    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      // Web: open in new tab
      window.open(url, "_blank");
      // If you also run this in a native shell, you’d use Linking.openURL(url)
      return;
    }

    // Fallback: use internal HTML5 video player for direct .mp4 links
    setCurrentVideo({
      id: String(video.id),
      title: video.title,
      videoUrl: url,
      thumbnail: video.thumbnail,
    });
    setIsPlayerOpen(true);
  };


  return (
    <div className="pb-4 pt-4 px-4 max-w-md mx-auto">
      {/* Featured Video */}
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
            
            {/* Download Button - Bottom Left
            <div className="absolute bottom-4 left-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownload();
                      }}
                      variant="ghost"
                      size="icon"
                      disabled={isSaved}
                      className="h-10 w-10 bg-black/80 backdrop-blur-sm hover:bg-black/90 text-white rounded-full"
                    >
                      {isSaved ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        <Download className="w-5 h-5" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{isSaved ? "Downloaded" : "Download"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
            
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

      {/* Recent Videos */}
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5 text-primary" />
          {t('watch.recentMessages')}
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
              {selectedDate ? format(selectedDate, "MMM d") : t('watch.date')}
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

              {/* Download Button
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
                            id: `video-${video.id}`,
                            type: "video",
                            title: video.title,
                            date: featuredVideo.date,
                            content: video,
                          });
                        }}
                      >
                        {isContentSaved(`video-${video.id}`) ? (
                          <Check className="w-4 h-4 text-primary" />
                        ) : (
                          <Download className="w-4 h-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isContentSaved(`video-${video.id}`) ? "Downloaded" : "Download"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div> */}
            </CardContent>
          </Card>
        ))}
      </div>

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
