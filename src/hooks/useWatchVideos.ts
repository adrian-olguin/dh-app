import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { es, pt } from "date-fns/locale";
import tvThumbnail from "@/assets/TV-thumbnail.jpg";

export interface WatchVideo {
  id: string;
  title: string;
  description?: string;
  duration: string;
  thumbnail: string;
  videoUrl: string;
  date?: string;
}

const getLocale = (language: string) => {
  switch (language) {
    case "es":
      return es;
    case "pt":
      return pt;
    default:
      return undefined;
  }
};

export const useWatchVideos = () => {
  const { t, i18n } = useTranslation();

  const videoDate = new Date(2025, 11, 8); // December 8, 2025 (month is 0-based)

  const featuredVideo: WatchVideo = {
    id: "video-2025-11-09",
    date: format(videoDate, "MMMM d, yyyy", { locale: getLocale(i18n.language) }),
    title: t("watch.featuredTitle"),
    description: t("watch.featuredDescription"),
    thumbnail: tvThumbnail,
    duration: "28:45",
    videoUrl:
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
  };

  const recentVideos: WatchVideo[] = [
    {
      id: "video-1",
      title: t("watch.videos.powerOfFaith"),
      duration: "24:30",
      thumbnail: tvThumbnail,
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: "video-2",
      title: t("watch.videos.livingWithPurpose"),
      duration: "31:15",
      thumbnail: tvThumbnail,
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      id: "video-3",
      title: t("watch.videos.overcomingChallenges"),
      duration: "26:50",
      thumbnail: tvThumbnail,
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      id: "video-4",
      title: t("watch.videos.walkingInLove"),
      duration: "29:10",
      thumbnail:
        "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=400&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
      id: "video-5",
      title: t("watch.videos.godsGrace"),
      duration: "27:35",
      thumbnail:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      id: "video-6",
      title: t("watch.videos.buildingRelationships"),
      duration: "32:20",
      thumbnail:
        "https://images.unsplash.com/photo-1516475429286-465d815a0df7?w=400&q=80",
      videoUrl:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    },
  ];

  return { featuredVideo, recentVideos };
};
