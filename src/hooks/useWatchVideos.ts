import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WatchVideo {
  id: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  date?: string;
  published_at?: string;
  link?: string;
}

interface VideoResponse {
  id: string;
  title: string;
  description: string;
  duration: string;
  image_url: string;
  video_url: string;
  published_at: string;
  link?: string;
}

export const useWatchVideos = () => {
  const { i18n } = useTranslation();

  const {
    data: videos = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["watch-videos", i18n.language],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "fetch-pastor-rick-content",
        {
          body: {
            type: "tv",
            language: i18n.language,
          },
        }
      );

      if (error) throw error;
      if (!data?.success || !data?.videos) {
        throw new Error("Failed to fetch videos");
      }

      // Transform videos to WatchVideo format
      const watchVideos = (data.videos as VideoResponse[]).map((video) => ({
        id: video.link || video.published_at || video.id,
        title: video.title,
        description: video.description,
        date: new Date(video.published_at).toLocaleDateString(
          i18n.language === "es" ? "es-ES" : "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        ),
        duration: video.duration,
        thumbnail: video.image_url || "https://pd-website-content.s3.us-east-2.amazonaws.com/dailyhope/uncategorized/RickWarren-DH_1400x1400.jpg",
        videoUrl: video.video_url,
        published_at: video.published_at,
        link: video.link || video.video_url || "",
      })) as WatchVideo[];

      // Sort by published_at date (newest first)
      watchVideos.sort(
        (a, b) =>
          new Date(b.published_at || 0).getTime() -
          new Date(a.published_at || 0).getTime()
      );

      return watchVideos;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  // First video is featured, rest are recent
  const featuredVideo = videos[0] || null;
  const recentVideos = videos.slice(1);

  return {
    featuredVideo,
    recentVideos,
    videos,
    isLoading,
    error,
    refetch,
  };
};
